package workers

import (
	"context"
	"errors"
	"fmt"
	"sync/atomic"
	"testing"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/jobs"
	"github.com/KrrishSR4/Distributed-job-queue/server/internal/models"
)

type mockFailingProcessor struct{}

func (m *mockFailingProcessor) Process(ctx context.Context, job *models.Job, workerID string) error {
	return errors.New("simulated processing error")
}

func TestWorkerPoolStartup(t *testing.T) {
	repo := jobs.NewMemoryRepository()
	queue := jobs.NewMemoryQueue()
	processor := NewDemoProcessor(0)

	pool := NewWorkerPool(5, repo, queue, processor)
	if pool.WorkerCount() != 5 {
		t.Fatalf("expected 5 workers, got %d", pool.WorkerCount())
	}

	pool.Start()
	pool.Stop()
}

func TestWorkerJobLifecycleSuccess(t *testing.T) {
	repo := jobs.NewMemoryRepository()
	queue := jobs.NewMemoryQueue()
	processor := NewDemoProcessor(10 * time.Millisecond)

	ctx := context.Background()

	job := &models.Job{
		ID:          "job-test-success-1",
		Type:        "email.send",
		Status:      models.StatusQueued,
		Attempts:    0,
		MaxAttempts: 3,
		CreatedAt:   time.Now().UTC(),
	}

	if err := repo.Create(ctx, job); err != nil {
		t.Fatalf("failed to create job in repo: %v", err)
	}

	if err := queue.Enqueue(ctx, job); err != nil {
		t.Fatalf("failed to enqueue job: %v", err)
	}

	pool := NewWorkerPool(2, repo, queue, processor)
	pool.Start()

	// Give worker time to consume and complete job
	time.Sleep(100 * time.Millisecond)
	pool.Stop()

	updatedJob, err := repo.GetByID(ctx, "job-test-success-1")
	if err != nil {
		t.Fatalf("failed to get job from repo: %v", err)
	}

	if updatedJob.Status != models.StatusCompleted {
		t.Errorf("expected job status completed, got %s", updatedJob.Status)
	}

	if updatedJob.WorkerID == nil || *updatedJob.WorkerID == "" {
		t.Errorf("expected worker_id to be populated, got nil/empty")
	}

	if updatedJob.StartedAt == nil {
		t.Errorf("expected started_at timestamp to be populated")
	}

	if updatedJob.CompletedAt == nil {
		t.Errorf("expected completed_at timestamp to be populated")
	}
}

func TestWorkerJobLifecycleFailure(t *testing.T) {
	repo := jobs.NewMemoryRepository()
	queue := jobs.NewMemoryQueue()
	failingProcessor := &mockFailingProcessor{}

	ctx := context.Background()

	job := &models.Job{
		ID:          "job-test-fail-1",
		Type:        "payment.charge",
		Status:      models.StatusQueued,
		Attempts:    0,
		MaxAttempts: 3,
		CreatedAt:   time.Now().UTC(),
	}

	if err := repo.Create(ctx, job); err != nil {
		t.Fatalf("failed to create job in repo: %v", err)
	}

	if err := queue.Enqueue(ctx, job); err != nil {
		t.Fatalf("failed to enqueue job: %v", err)
	}

	pool := NewWorkerPool(1, repo, queue, failingProcessor)
	pool.Start()

	time.Sleep(100 * time.Millisecond)
	pool.Stop()

	updatedJob, err := repo.GetByID(ctx, "job-test-fail-1")
	if err != nil {
		t.Fatalf("failed to get job from repo: %v", err)
	}

	if updatedJob.Status != models.StatusFailed {
		t.Errorf("expected job status failed, got %s", updatedJob.Status)
	}

	if updatedJob.Error == nil || *updatedJob.Error != "simulated processing error" {
		t.Errorf("expected error string 'simulated processing error', got %v", updatedJob.Error)
	}

	if updatedJob.FailedAt == nil {
		t.Errorf("expected failed_at timestamp to be populated")
	}
}

type concurrentTrackingProcessor struct {
	activeCount int32
	maxActive   int32
	delay       time.Duration
}

func (c *concurrentTrackingProcessor) Process(ctx context.Context, job *models.Job, workerID string) error {
	current := atomic.AddInt32(&c.activeCount, 1)

	for {
		max := atomic.LoadInt32(&c.maxActive)
		if current <= max {
			break
		}
		if atomic.CompareAndSwapInt32(&c.maxActive, max, current) {
			break
		}
	}

	time.Sleep(c.delay)
	atomic.AddInt32(&c.activeCount, -1)
	return nil
}

func TestWorkerPoolConcurrency(t *testing.T) {
	repo := jobs.NewMemoryRepository()
	queue := jobs.NewMemoryQueue()
	proc := &concurrentTrackingProcessor{delay: 50 * time.Millisecond}

	ctx := context.Background()

	// Enqueue 6 jobs
	for i := 1; i <= 6; i++ {
		jobID := fmt.Sprintf("job-concurrent-%d", i)
		job := &models.Job{
			ID:        jobID,
			Type:      "task.batch",
			Status:    models.StatusQueued,
			CreatedAt: time.Now().UTC(),
		}
		_ = repo.Create(ctx, job)
		_ = queue.Enqueue(ctx, job)
	}

	// 3 workers
	pool := NewWorkerPool(3, repo, queue, proc)
	pool.Start()

	time.Sleep(250 * time.Millisecond)
	pool.Stop()

	maxCon := atomic.LoadInt32(&proc.maxActive)
	if maxCon < 2 {
		t.Errorf("expected concurrent execution (at least 2 active simultaneously), got max %d", maxCon)
	}
}

func TestWorkerPoolGracefulShutdown(t *testing.T) {
	repo := jobs.NewMemoryRepository()
	queue := jobs.NewMemoryQueue()
	processor := NewDemoProcessor(100 * time.Millisecond)

	pool := NewWorkerPool(3, repo, queue, processor)
	pool.Start()

	doneCh := make(chan struct{})
	go func() {
		pool.Stop()
		close(doneCh)
	}()

	select {
	case <-doneCh:
		// Success: worker pool shutdown completed cleanly
	case <-time.After(2 * time.Second):
		t.Fatal("worker pool shutdown deadlocked or timed out")
	}
}

func TestWorkerMalformedPayload(t *testing.T) {
	repo := jobs.NewMemoryRepository()
	queue := jobs.NewMemoryQueue()
	processor := NewDemoProcessor(0)

	ctx := context.Background()

	// Enqueue a job with empty ID to simulate malformed payload
	_ = queue.Enqueue(ctx, &models.Job{
		ID: "",
	})

	pool := NewWorkerPool(1, repo, queue, processor)
	pool.Start()

	time.Sleep(50 * time.Millisecond)
	pool.Stop()
}
