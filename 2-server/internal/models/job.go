package models

import (
	"encoding/json"
	"fmt"
	"time"
)

type JobStatus string
type JobPriority string

const (
	StatusQueued     JobStatus = "queued"
	StatusScheduled  JobStatus = "scheduled"
	StatusProcessing JobStatus = "processing"
	StatusCompleted  JobStatus = "completed"
	StatusFailed     JobStatus = "failed"
	StatusCancelled  JobStatus = "cancelled"

	PriorityLow      JobPriority = "low"
	PriorityMedium   JobPriority = "medium"
	PriorityHigh     JobPriority = "high"
	PriorityCritical JobPriority = "critical"
)

type Job struct {
	ID          string          `json:"id"`
	Type        string          `json:"type"`
	Payload     json.RawMessage `json:"payload"`
	Priority    JobPriority     `json:"priority"`
	Status      JobStatus       `json:"status"`
	Attempts    int             `json:"attempts"`
	MaxAttempts int             `json:"max_attempts"`
	ScheduledAt *time.Time      `json:"scheduled_at,omitempty"`
	CreatedAt   time.Time       `json:"created_at"`
	StartedAt   *time.Time      `json:"started_at,omitempty"`
	CompletedAt *time.Time      `json:"completed_at,omitempty"`
	FailedAt    *time.Time      `json:"failed_at,omitempty"`
	Error       *string         `json:"error,omitempty"`
	WorkerID    *string         `json:"worker_id,omitempty"`
}

type DLQPayload struct {
	JobID       string    `json:"job_id"`
	Type        string    `json:"type"`
	Attempts    int       `json:"attempts"`
	MaxAttempts int       `json:"max_attempts"`
	FailedAt    time.Time `json:"failed_at"`
	Reason      string    `json:"reason"`
	WorkerID    string    `json:"worker_id,omitempty"`
}

type CreateJobRequest struct {
	Type        string          `json:"type"`
	Payload     json.RawMessage `json:"payload"`
	Priority    JobPriority     `json:"priority,omitempty"`
	MaxAttempts int             `json:"max_attempts,omitempty"`
	ScheduledAt *time.Time      `json:"scheduled_at,omitempty"`
}

func (r *CreateJobRequest) Validate() error {
	if r.Type == "" {
		return fmt.Errorf("job type is required")
	}

	if r.Priority == "" {
		r.Priority = PriorityMedium
	} else {
		switch r.Priority {
		case PriorityLow, PriorityMedium, PriorityHigh, PriorityCritical:
		default:
			return fmt.Errorf("invalid priority level: %s", r.Priority)
		}
	}

	if r.MaxAttempts <= 0 {
		r.MaxAttempts = 3
	}

	if len(r.Payload) == 0 {
		r.Payload = json.RawMessage("{}")
	}

	return nil
}

type JobListFilter struct {
	Status   JobStatus   `json:"status,omitempty"`
	Priority JobPriority `json:"priority,omitempty"`
	Type     string      `json:"type,omitempty"`
	Page     int         `json:"page"`
	Limit    int         `json:"limit"`
}

type PaginatedJobsResponse struct {
	Jobs       []*Job `json:"jobs"`
	Total      int    `json:"total"`
	Page       int    `json:"page"`
	Limit      int    `json:"limit"`
	TotalPages int    `json:"total_pages"`
}
