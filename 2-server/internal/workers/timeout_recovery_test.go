package workers

import (
	"context"
	"testing"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/jobs"
	"github.com/KrrishSR4/Distributed-job-queue/server/internal/models"
)

// mockProcessor specifically tests context timeout handling
type mockProcessor struct {
	delay time.Duration
}

func (m *mockProcessor) Process(ctx context.Context, job *models.Job, workerID string) error {
	if m.delay > 0 {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-time.After(m.delay):
		}
	}
	return nil
}

func TestJobTimeout(t *testing.T) {
	repo := jobs.NewMemoryRepository()
	queue := jobs.NewMemoryQueue()

	now := time.Now().UTC()
	job := &models.Job{
		ID:          "job-timeout-test",
		Type:        "test",
		Status:      models.StatusQueued,
		Attempts:    0,
		MaxAttempts: 3,
		CreatedAt:   now,
	}
	_ = repo.Create(context.Background(), job)

	// Simulate queue payload
	payload := &jobs.QueuePayload{
		JobID:    job.ID,
		Type:     job.Type,
		Priority: models.PriorityMedium,
	}
	_ = queue.Enqueue(context.Background(), job)

	retryMgr := NewRetryManager(1*time.Millisecond, 2*time.Millisecond, queue, repo, nil)

	// Processor that takes 100ms
	processor := &mockProcessor{delay: 100 * time.Millisecond}

	// Worker with 50ms timeout (should time out)
	worker := NewWorker("worker-1", queue, repo, processor, retryMgr, 50*time.Millisecond, nil)

	// Run processJobPayload directly
	worker.processJobPayload(context.Background(), payload)

	// The job should have been moved to StatusScheduled by the retry manager (due to retry)
	updatedJob, _ := repo.GetByID(context.Background(), job.ID)

	if updatedJob.Status != models.StatusScheduled {
		t.Errorf("Expected job to be retried (StatusScheduled), got %s", updatedJob.Status)
	}
	if updatedJob.Attempts != 1 {
		t.Errorf("Expected attempts to be 1, got %d", updatedJob.Attempts)
	}
	if updatedJob.Error == nil || *updatedJob.Error == "" {
		t.Errorf("Expected error to be set from timeout")
	}
}

func TestStaleJobRecovery(t *testing.T) {
	repo := jobs.NewMemoryRepository()
	queue := jobs.NewMemoryQueue()
	ctx := context.Background()

	now := time.Now().UTC()

	// Stale processing job
	staleJob := &models.Job{
		ID:        "job-stale",
		Type:      "test",
		Status:    models.StatusProcessing,
		StartedAt: func() *time.Time { t := now.Add(-5 * time.Minute); return &t }(),
		CreatedAt: now.Add(-6 * time.Minute),
	}
	_ = repo.Create(ctx, staleJob)

	// Fresh processing job (should NOT be recovered)
	freshJob := &models.Job{
		ID:        "job-fresh",
		Type:      "test",
		Status:    models.StatusProcessing,
		StartedAt: &now, // Just started
		CreatedAt: now.Add(-1 * time.Minute),
	}
	_ = repo.Create(ctx, freshJob)

	scheduler := NewScheduler(repo, queue, 10*time.Second, 10*time.Second, 1*time.Minute, 50, nil)

	// Manually trigger recovery
	scheduler.recoverStaleJobs(ctx)

	// Check stale job
	recovered, _ := repo.GetByID(ctx, "job-stale")
	if recovered.Status != models.StatusQueued {
		t.Errorf("Expected stale job to be recovered (StatusQueued), got %s", recovered.Status)
	}
	if recovered.Error == nil || *recovered.Error != "Worker timeout or crash detected" {
		t.Errorf("Expected recovery error message")
	}

	// Check fresh job
	untouched, _ := repo.GetByID(ctx, "job-fresh")
	if untouched.Status != models.StatusProcessing {
		t.Errorf("Expected fresh job to remain processing, got %s", untouched.Status)
	}
}

func TestJobTimeoutExhaustsMaxAttempts(t *testing.T) {
	repo := jobs.NewMemoryRepository()
	queue := jobs.NewMemoryQueue()

	now := time.Now().UTC()
	job := &models.Job{
		ID:          "job-timeout-dlq",
		Type:        "test",
		Status:      models.StatusQueued,
		Attempts:    2,
		MaxAttempts: 3,
		CreatedAt:   now,
	}
	_ = repo.Create(context.Background(), job)

	payload := &jobs.QueuePayload{
		JobID:    job.ID,
		Type:     job.Type,
		Priority: models.PriorityMedium,
	}

	retryMgr := NewRetryManager(1*time.Millisecond, 2*time.Millisecond, queue, repo, nil)
	processor := &mockProcessor{delay: 100 * time.Millisecond}
	worker := NewWorker("worker-1", queue, repo, processor, retryMgr, 50*time.Millisecond, nil)

	// Run processJobPayload. Attempt 2 -> 3 (max). Should go to DLQ.
	worker.processJobPayload(context.Background(), payload)

	updatedJob, _ := repo.GetByID(context.Background(), job.ID)
	if updatedJob.Status != models.StatusFailed {
		t.Errorf("Expected job to be Failed (reached DLQ), got %s", updatedJob.Status)
	}
}
