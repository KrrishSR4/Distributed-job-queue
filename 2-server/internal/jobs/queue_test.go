package jobs

import (
	"context"
	"encoding/json"
	"testing"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/models"
)

func TestQueuePayloadFormat(t *testing.T) {
	job := &models.Job{
		ID:        "job-test-123",
		Type:      "image.resize",
		Priority:  models.PriorityHigh,
		Attempts:  0,
		CreatedAt: time.Now(),
	}

	payload := QueuePayload{
		JobID:    job.ID,
		Type:     job.Type,
		Priority: job.Priority,
		Attempts: job.Attempts,
	}

	bytes, err := json.Marshal(payload)
	if err != nil {
		t.Fatalf("failed to marshal queue payload: %v", err)
	}

	var unmarshaled QueuePayload
	if err := json.Unmarshal(bytes, &unmarshaled); err != nil {
		t.Fatalf("failed to unmarshal queue payload: %v", err)
	}

	if unmarshaled.JobID != job.ID {
		t.Errorf("expected job_id %s, got %s", job.ID, unmarshaled.JobID)
	}
	if unmarshaled.Type != job.Type {
		t.Errorf("expected type %s, got %s", job.Type, unmarshaled.Type)
	}
	if unmarshaled.Priority != models.PriorityHigh {
		t.Errorf("expected priority %s, got %s", models.PriorityHigh, unmarshaled.Priority)
	}
}

func TestMemoryQueueEnqueue(t *testing.T) {
	mq := NewMemoryQueue()
	ctx := context.Background()

	job := &models.Job{
		ID:       "job-test-456",
		Type:     "pdf.generate",
		Priority: models.PriorityMedium,
		Attempts: 0,
	}

	if err := mq.Enqueue(ctx, job); err != nil {
		t.Fatalf("failed to enqueue to MemoryQueue: %v", err)
	}

	if len(mq.Enqueued) != 1 {
		t.Fatalf("expected 1 enqueued item, got %d", len(mq.Enqueued))
	}

	if mq.Enqueued[0].JobID != "job-test-456" {
		t.Errorf("expected enqueued job_id job-test-456, got %s", mq.Enqueued[0].JobID)
	}
}
