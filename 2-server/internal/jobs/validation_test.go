package jobs

import (
	"encoding/json"
	"testing"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/models"
)

func TestCreateJobRequestValidation(t *testing.T) {
	tests := []struct {
		name        string
		req         models.CreateJobRequest
		expectError bool
		check       func(t *testing.T, req models.CreateJobRequest)
	}{
		{
			name: "Valid request with defaults",
			req: models.CreateJobRequest{
				Type: "email.send",
			},
			expectError: false,
			check: func(t *testing.T, req models.CreateJobRequest) {
				if req.Priority != models.PriorityMedium {
					t.Errorf("expected default priority %s, got %s", models.PriorityMedium, req.Priority)
				}
				if req.MaxAttempts != 3 {
					t.Errorf("expected default max_attempts 3, got %d", req.MaxAttempts)
				}
				if string(req.Payload) != "{}" {
					t.Errorf("expected default payload {}, got %s", string(req.Payload))
				}
			},
		},
		{
			name: "Missing job type",
			req: models.CreateJobRequest{
				Type: "",
			},
			expectError: true,
		},
		{
			name: "Invalid priority level",
			req: models.CreateJobRequest{
				Type:     "video.process",
				Priority: "ultra_high",
			},
			expectError: true,
		},
		{
			name: "Valid custom request",
			req: models.CreateJobRequest{
				Type:        "data.export",
				Priority:    models.PriorityCritical,
				MaxAttempts: 5,
				Payload:     json.RawMessage(`{"user_id":123}`),
			},
			expectError: false,
			check: func(t *testing.T, req models.CreateJobRequest) {
				if req.Priority != models.PriorityCritical {
					t.Errorf("expected priority %s, got %s", models.PriorityCritical, req.Priority)
				}
				if req.MaxAttempts != 5 {
					t.Errorf("expected max_attempts 5, got %d", req.MaxAttempts)
				}
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.req.Validate()
			if tt.expectError && err == nil {
				t.Errorf("expected error, got nil")
			}
			if !tt.expectError && err != nil {
				t.Errorf("unexpected error: %v", err)
			}
			if !tt.expectError && tt.check != nil {
				tt.check(t, tt.req)
			}
		})
	}
}
