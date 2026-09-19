package workers

import (
	"context"
	"testing"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/jobs"
	"github.com/KrrishSR4/Distributed-job-queue/server/internal/models"
)

func TestScheduler_ProcessDueJobs(t *testing.T) {
	repo := jobs.NewMemoryRepository()
	queue := jobs.NewMemoryQueue()
	ctx := context.Background()

	now := time.Now().UTC()
	past := now.Add(-1 * time.Hour)
	future := now.Add(1 * time.Hour)

	// Create a scheduled job in the past (due)
	dueJob := &models.Job{
		ID:          "job-due",
		Type:        "test",
		Status:      models.StatusScheduled,
		ScheduledAt: &past,
		CreatedAt:   now,
	}
	_ = repo.Create(ctx, dueJob)

	// Create a scheduled job in the future (not due)
	futureJob := &models.Job{
		ID:          "job-future",
		Type:        "test",
		Status:      models.StatusScheduled,
		ScheduledAt: &future,
		CreatedAt:   now,
	}
	_ = repo.Create(ctx, futureJob)

	// Create a queued job (already processing/queued, shouldn't be touched by scheduler)
	queuedJob := &models.Job{
		ID:        "job-queued",
		Type:      "test",
		Status:    models.StatusQueued,
		CreatedAt: now,
	}
	_ = repo.Create(ctx, queuedJob)

	scheduler := NewScheduler(repo, queue, 100*time.Millisecond, 10*time.Second, 60*time.Second, 10, nil)

	// Manually trigger processDueJobs
	scheduler.processDueJobs(ctx)

	// Check DB states
	dj, _ := repo.GetByID(ctx, "job-due")
	if dj.Status != models.StatusQueued {
		t.Errorf("expected due job to be queued, got %s", dj.Status)
	}

	fj, _ := repo.GetByID(ctx, "job-future")
	if fj.Status != models.StatusScheduled {
		t.Errorf("expected future job to remain scheduled, got %s", fj.Status)
	}

	qj, _ := repo.GetByID(ctx, "job-queued")
	if qj.Status != models.StatusQueued {
		t.Errorf("expected queued job to remain queued, got %s", qj.Status)
	}

	// Check Queue
	if len(queue.Enqueued) != 1 {
		t.Fatalf("expected 1 job in queue, got %d", len(queue.Enqueued))
	}
	if queue.Enqueued[0].JobID != "job-due" {
		t.Errorf("expected job-due in queue, got %s", queue.Enqueued[0].JobID)
	}
}

func TestScheduler_GracefulShutdown(t *testing.T) {
	repo := jobs.NewMemoryRepository()
	queue := jobs.NewMemoryQueue()
	ctx := context.Background()

	scheduler := NewScheduler(repo, queue, 10*time.Millisecond, 10*time.Second, 60*time.Second, 10, nil)

	done := make(chan struct{})
	go func() {
		scheduler.Start(ctx)
		close(done)
	}()

	// Let it tick a few times
	time.Sleep(50 * time.Millisecond)

	// Stop it gracefully
	scheduler.Stop()

	select {
	case <-done:
		// success
	case <-time.After(1 * time.Second):
		t.Error("scheduler did not stop gracefully")
	}
}
