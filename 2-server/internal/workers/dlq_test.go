package workers

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"testing"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/jobs"
	"github.com/KrrishSR4/Distributed-job-queue/server/internal/models"
)

type failingProcessorWithCounter struct {
	mu           sync.Mutex
	processCalls map[string]int
	errMsg       string
}

func newFailingProcessorWithCounter(errMsg string) *failingProcessorWithCounter {
	return &failingProcessorWithCounter{
		processCalls: make(map[string]int),
		errMsg:       errMsg,
	}
}

func (f *failingProcessorWithCounter) Process(ctx context.Context, job *models.Job, workerID string) error {
	f.mu.Lock()
	f.processCalls[job.ID]++
	f.mu.Unlock()
	return errors.New(f.errMsg)
}

func (f *failingProcessorWithCounter) GetCalls(jobID string) int {
	f.mu.Lock()
	defer f.mu.Unlock()
	return f.processCalls[jobID]
}

type errorQueue struct {
	jobs.Queue
}

func (e *errorQueue) DeadLetter(ctx context.Context, payload *models.DLQPayload) error {
	return errors.New("simulated redis DLQ network timeout")
}

func TestDLQ_JobSuccess_NoDLQEntry(t *testing.T) {
	repo := jobs.NewMemoryRepository()
	queue := jobs.NewMemoryQueue()
	processor := NewDemoProcessor(0)
	ctx := context.Background()

	job := &models.Job{
		ID:          "dlq-job-success",
		Type:        "email.welcome",
		Status:      models.StatusQueued,
		Attempts:    0,
		MaxAttempts: 3,
		CreatedAt:   time.Now().UTC(),
	}

	_ = repo.Create(ctx, job)
	_ = queue.Enqueue(ctx, job)

	pool := NewWorkerPool(1, "test-instance", repo, queue, processor, 1*time.Millisecond, 2*time.Millisecond, 30*time.Second, nil)
	pool.Start()

	time.Sleep(100 * time.Millisecond)
	pool.Stop()

	// Verify job completed
	updatedJob, err := repo.GetByID(ctx, "dlq-job-success")
	if err != nil || updatedJob == nil {
		t.Fatalf("failed to fetch job: %v", err)
	}
	if updatedJob.Status != models.StatusCompleted {
		t.Errorf("expected status completed, got %s", updatedJob.Status)
	}

	// Verify 0 DLQ entries
	if len(queue.DeadLettered) != 0 {
		t.Errorf("expected 0 DLQ entries for successful job, got %d", len(queue.DeadLettered))
	}
}

func TestDLQ_JobFails_WithRetriesRemaining_NoDLQEntry(t *testing.T) {
	repo := jobs.NewMemoryRepository()
	queue := jobs.NewMemoryQueue()
	processor := newFailingProcessorWithCounter("transient error")
	ctx := context.Background()

	job := &models.Job{
		ID:          "dlq-job-retry",
		Type:        "payment.process",
		Status:      models.StatusQueued,
		Attempts:    0,
		MaxAttempts: 3,
		CreatedAt:   time.Now().UTC(),
	}

	_ = repo.Create(ctx, job)
	_ = queue.Enqueue(ctx, job)

	// Create worker pool with 50ms retry base delay
	retryMgr := NewRetryManager(50*time.Millisecond, 100*time.Millisecond, queue, repo, nil)
	worker := NewWorker("worker-retry-1", queue, repo, processor, retryMgr, 30*time.Second, nil)

	workerCtx, cancel := context.WithCancel(ctx)
	go worker.Start(workerCtx)

	// Wait for attempt 1 to run
	time.Sleep(30 * time.Millisecond)
	cancel()

	updatedJob, _ := repo.GetByID(ctx, "dlq-job-retry")
	if updatedJob == nil {
		t.Fatalf("job not found")
	}

	// Attempts should be 1 (retries remaining)
	if updatedJob.Attempts != 1 {
		t.Errorf("expected attempts = 1, got %d", updatedJob.Attempts)
	}

	// Should NOT be dead lettered yet
	if len(queue.DeadLettered) != 0 {
		t.Errorf("expected 0 DLQ entries while retries remain, got %d", len(queue.DeadLettered))
	}
}

func TestDLQ_JobReachesMaxAttempts_MovesToDLQ(t *testing.T) {
	repo := jobs.NewMemoryRepository()
	queue := jobs.NewMemoryQueue()
	processor := newFailingProcessorWithCounter("permanent database connection loss")
	ctx := context.Background()

	job := &models.Job{
		ID:          "dlq-job-max-fail",
		Type:        "report.generate",
		Status:      models.StatusQueued,
		Attempts:    0,
		MaxAttempts: 2,
		CreatedAt:   time.Now().UTC(),
	}

	_ = repo.Create(ctx, job)
	_ = queue.Enqueue(ctx, job)

	scheduler := NewScheduler(repo, queue, 10*time.Millisecond, 10*time.Second, 1*time.Minute, 10, nil)
	schedCtx, schedCancel := context.WithCancel(ctx)
	go scheduler.Start(schedCtx)

	pool := NewWorkerPool(1, "test-instance", repo, queue, processor, 10*time.Millisecond, 20*time.Millisecond, 30*time.Second, nil)
	pool.Start()

	// Wait for attempt 1 (fails) + attempt 2 (fails, max reached -> DLQ)
	time.Sleep(250 * time.Millisecond)
	pool.Stop()
	schedCancel()

	updatedJob, err := repo.GetByID(ctx, "dlq-job-max-fail")
	if err != nil || updatedJob == nil {
		t.Fatalf("failed to fetch job: %v", err)
	}

	// Check PostgreSQL state: status = failed
	if updatedJob.Status != models.StatusFailed {
		t.Errorf("expected status 'failed', got %s", updatedJob.Status)
	}
	if updatedJob.FailedAt == nil {
		t.Errorf("expected failed_at timestamp to be set")
	}
	if updatedJob.Error == nil || *updatedJob.Error != "permanent database connection loss" {
		t.Errorf("expected error message in DB, got %v", updatedJob.Error)
	}

	// Check exactly 1 DLQ entry created
	deadLettered := queue.GetDeadLettered()
	if len(deadLettered) != 1 {
		t.Fatalf("expected exactly 1 DLQ entry, got %d", len(deadLettered))
	}

	dlqPayload := deadLettered[0]
	if dlqPayload.JobID != "dlq-job-max-fail" {
		t.Errorf("expected DLQ job_id 'dlq-job-max-fail', got %s", dlqPayload.JobID)
	}
	if dlqPayload.Type != "report.generate" {
		t.Errorf("expected DLQ type 'report.generate', got %s", dlqPayload.Type)
	}
	if dlqPayload.Attempts != 2 {
		t.Errorf("expected DLQ attempts = 2, got %d", dlqPayload.Attempts)
	}
	if dlqPayload.MaxAttempts != 2 {
		t.Errorf("expected DLQ max_attempts = 2, got %d", dlqPayload.MaxAttempts)
	}
	if dlqPayload.Reason != "permanent database connection loss" {
		t.Errorf("expected DLQ reason 'permanent database connection loss', got %s", dlqPayload.Reason)
	}
	if dlqPayload.WorkerID == "" {
		t.Errorf("expected DLQ worker_id to be set")
	}

	// Verify no additional retries occur (processor was called exactly 2 times)
	if calls := processor.GetCalls("dlq-job-max-fail"); calls != 2 {
		t.Errorf("expected exactly 2 process calls, got %d", calls)
	}
}

func TestDLQ_EnqueueFailureHandledGracefully(t *testing.T) {
	repo := jobs.NewMemoryRepository()
	memQueue := jobs.NewMemoryQueue()
	errQ := &errorQueue{Queue: memQueue}
	processor := newFailingProcessorWithCounter("fatal failure")
	ctx := context.Background()

	job := &models.Job{
		ID:          "dlq-job-err-handle",
		Type:        "webhook.deliver",
		Status:      models.StatusQueued,
		Attempts:    0,
		MaxAttempts: 1,
		CreatedAt:   time.Now().UTC(),
	}

	_ = repo.Create(ctx, job)
	_ = memQueue.Enqueue(ctx, job)

	retryMgr := NewRetryManager(10*time.Millisecond, 20*time.Millisecond, errQ, repo, nil)
	worker := NewWorker("worker-dlq-err", errQ, repo, processor, retryMgr, 30*time.Second, nil)

	workerCtx, cancel := context.WithCancel(ctx)
	go worker.Start(workerCtx)

	time.Sleep(50 * time.Millisecond)
	cancel()

	// DB state should still be updated to failed despite Redis DLQ error
	updatedJob, _ := repo.GetByID(ctx, "dlq-job-err-handle")
	if updatedJob == nil || updatedJob.Status != models.StatusFailed {
		t.Errorf("expected DB status failed despite DLQ network error")
	}
}

func TestDLQ_ConcurrentWorkersDeadLettering(t *testing.T) {
	repo := jobs.NewMemoryRepository()
	queue := jobs.NewMemoryQueue()
	processor := newFailingProcessorWithCounter("concurrent failure")
	ctx := context.Background()

	jobCount := 10
	for i := 1; i <= jobCount; i++ {
		jobID := fmt.Sprintf("dlq-concurrent-%d", i)
		job := &models.Job{
			ID:          jobID,
			Type:        "batch.item",
			Status:      models.StatusQueued,
			Attempts:    0,
			MaxAttempts: 1,
			CreatedAt:   time.Now().UTC(),
		}
		_ = repo.Create(ctx, job)
		_ = queue.Enqueue(ctx, job)
	}

	scheduler := NewScheduler(repo, queue, 10*time.Millisecond, 10*time.Second, 1*time.Minute, 10, nil)
	schedCtx, schedCancel := context.WithCancel(ctx)
	go scheduler.Start(schedCtx)

	// 4 workers processing 10 failing jobs concurrently
	pool := NewWorkerPool(4, "test-instance", repo, queue, processor, 10*time.Millisecond, 20*time.Millisecond, 30*time.Second, nil)
	pool.Start()

	time.Sleep(300 * time.Millisecond)
	pool.Stop()
	schedCancel()

	// All 10 jobs should be in DLQ
	dlqCount := len(queue.GetDeadLettered())

	if dlqCount != jobCount {
		t.Errorf("expected %d DLQ entries from concurrent workers, got %d", jobCount, dlqCount)
	}
}
