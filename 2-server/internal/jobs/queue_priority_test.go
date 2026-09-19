package jobs

import (
	"context"
	"testing"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/models"
)

func TestMemoryQueue_PriorityOrdering(t *testing.T) {
	mq := NewMemoryQueue()
	ctx := context.Background()

	// Submit in this order: low A, high B, medium C, high D, low E
	jobs := []*models.Job{
		{ID: "low-A", Priority: models.PriorityLow},
		{ID: "high-B", Priority: models.PriorityHigh},
		{ID: "medium-C", Priority: models.PriorityMedium},
		{ID: "high-D", Priority: models.PriorityHigh},
		{ID: "low-E", Priority: models.PriorityLow},
	}

	for _, j := range jobs {
		_ = mq.Enqueue(ctx, j)
	}

	// Expected pop order: high-B, high-D, medium-C, low-A, low-E
	expectedIDs := []string{"high-B", "high-D", "medium-C", "low-A", "low-E"}

	for i, expectedID := range expectedIDs {
		payload, err := mq.Dequeue(ctx, 10*time.Millisecond)
		if err != nil {
			t.Fatalf("unexpected error on dequeue %d: %v", i, err)
		}
		if payload == nil {
			t.Fatalf("expected payload on dequeue %d, got nil", i)
		}
		if payload.JobID != expectedID {
			t.Errorf("step %d: expected job %s, got %s", i, expectedID, payload.JobID)
		}
	}
}
