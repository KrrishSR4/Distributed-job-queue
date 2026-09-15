package jobs

import (
	"context"
	"encoding/json"
	"testing"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/models"
)

func TestJobServiceCRUD(t *testing.T) {
	repo := NewMemoryRepository()
	service := NewJobService(repo)
	ctx := context.Background()

	// 1. Create Job
	req := models.CreateJobRequest{
		Type:        "email.welcome",
		Priority:    models.PriorityHigh,
		MaxAttempts: 3,
		Payload:     json.RawMessage(`{"recipient":"test@domain.com"}`),
	}

	createdJob, err := service.CreateJob(ctx, req)
	if err != nil {
		t.Fatalf("failed to create job: %v", err)
	}

	if createdJob.ID == "" {
		t.Errorf("expected non-empty UUID for job ID")
	}
	if createdJob.Status != models.StatusQueued {
		t.Errorf("expected status %s, got %s", models.StatusQueued, createdJob.Status)
	}

	// 2. Get Job By ID
	fetchedJob, err := service.GetJobByID(ctx, createdJob.ID)
	if err != nil {
		t.Fatalf("failed to fetch job by ID: %v", err)
	}
	if fetchedJob.Type != "email.welcome" {
		t.Errorf("expected type email.welcome, got %s", fetchedJob.Type)
	}

	// 3. List Jobs
	listResp, err := service.ListJobs(ctx, models.JobListFilter{Page: 1, Limit: 10})
	if err != nil {
		t.Fatalf("failed to list jobs: %v", err)
	}
	if listResp.Total != 1 {
		t.Errorf("expected total 1, got %d", listResp.Total)
	}

	// 4. Delete Job
	if err := service.DeleteJob(ctx, createdJob.ID); err != nil {
		t.Fatalf("failed to delete job: %v", err)
	}

	// 5. Verify Deletion
	_, err = service.GetJobByID(ctx, createdJob.ID)
	if err != ErrJobNotFound {
		t.Errorf("expected ErrJobNotFound after deletion, got %v", err)
	}
}
