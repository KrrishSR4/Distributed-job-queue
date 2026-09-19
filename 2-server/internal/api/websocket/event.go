package websocket

import "time"

// Event represents a single state change notification for a job.
type Event struct {
	Type      string      `json:"type"`
	JobID     string      `json:"job_id"`
	Timestamp time.Time   `json:"timestamp"`
	Data      interface{} `json:"data,omitempty"`
}

// Standard Event Types
const (
	EventJobQueued     = "job.queued"
	EventJobProcessing = "job.processing"
	EventJobCompleted  = "job.completed"
	EventJobFailed     = "job.failed"
	EventJobRetrying   = "job.retrying"
	EventJobCancelled  = "job.cancelled"
	EventJobDLQ        = "job.dlq"
	EventJobScheduled  = "job.scheduled"
	EventJobTimeout    = "job.timeout"
	EventJobRecovered  = "job.recovered"
)

// EventPublisher defines how backend components can broadcast events.
type EventPublisher interface {
	Publish(event Event)
}

// NoopEventPublisher is a fallback publisher used for testing or when WebSockets are disabled.
type NoopEventPublisher struct{}

func (n *NoopEventPublisher) Publish(event Event) {}
