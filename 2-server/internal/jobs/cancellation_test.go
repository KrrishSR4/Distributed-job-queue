package jobs

import (
	"context"
	"testing"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/models"
)

func TestCancellation_MemoryRepo(t *testing.T) {
	repo := NewMemoryRepository()
	ctx := context.Background()

	now := time.Now().UTC()

	// Create a queued job
	queuedJob := &models.Job{
		ID:        "job-queued",
		Type:      "test",
		Status:    models.StatusQueued,
		CreatedAt: now,
	}
	_ = repo.Create(ctx, queuedJob)

	// Create a scheduled job
	scheduledJob := &models.Job{
		ID:        "job-scheduled",
		Type:      "test",
		Status:    models.StatusScheduled,
		CreatedAt: now,
	}
	_ = repo.Create(ctx, scheduledJob)

	// Create a completed job
	completedJob := &models.Job{
		ID:        "job-completed",
		Type:      "test",
		Status:    models.StatusCompleted,
		CreatedAt: now,
	}
	_ = repo.Create(ctx, completedJob)

	// Cancel queued job
	if err := repo.Cancel(ctx, "job-queued"); err != nil {
		t.Fatalf("expected to cancel queued job, got error: %v", err)
	}

	// Cancel scheduled job
	if err := repo.Cancel(ctx, "job-scheduled"); err != nil {
		t.Fatalf("expected to cancel scheduled job, got error: %v", err)
	}

	// Cancel completed job (should fail)
	if err := repo.Cancel(ctx, "job-completed"); err != ErrJobNotCancellable {
		t.Fatalf("expected ErrJobNotCancellable when cancelling completed job, got: %v", err)
	}

	// Verify states
	qj, _ := repo.GetByID(ctx, "job-queued")
	if qj.Status != models.StatusCancelled {
		t.Errorf("expected job-queued to be cancelled, got %s", qj.Status)
	}

	sj, _ := repo.GetByID(ctx, "job-scheduled")
	if sj.Status != models.StatusCancelled {
		t.Errorf("expected job-scheduled to be cancelled, got %s", sj.Status)
	}

	cj, _ := repo.GetByID(ctx, "job-completed")
	if cj.Status != models.StatusCompleted {
		t.Errorf("expected job-completed to remain completed, got %s", cj.Status)
	}

	// Verify UpdateStatusProcessing fails for cancelled job
	err := repo.UpdateStatusProcessing(ctx, "job-queued", "worker-1", now)
	if err != ErrJobNotQueued {
		t.Errorf("expected ErrJobNotQueued when processing cancelled job, got %v", err)
	}
}
