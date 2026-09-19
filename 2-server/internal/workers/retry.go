package workers

import (
	"context"
	"fmt"
	"math"
	"math/rand"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/jobs"
	"github.com/KrrishSR4/Distributed-job-queue/server/internal/models"
	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/logger"
)

// RetryPolicy calculates exponential backoff with jitter
type RetryPolicy struct {
	BaseDelay time.Duration
	MaxDelay  time.Duration
}

// CalculateDelay returns the delay before the next retry attempt based on the current attempt number.
// Attempt should be >= 1 (where 1 means the first retry).
func (p *RetryPolicy) CalculateDelay(attempt int) time.Duration {
	if attempt <= 0 {
		return p.BaseDelay
	}

	// Exponential backoff: base * 2^(attempt-1)
	backoff := float64(p.BaseDelay) * math.Pow(2, float64(attempt-1))

	// Cap at MaxDelay
	if backoff > float64(p.MaxDelay) {
		backoff = float64(p.MaxDelay)
	}

	// Add 10-20% jitter to prevent thundering herd
	// rand.Float64() is between [0.0, 1.0).
	// We want jitter between [0.1, 0.2] of the backoff.
	jitterFactor := 0.1 + rand.Float64()*0.1
	jitter := backoff * jitterFactor

	finalDelay := backoff + jitter
	if finalDelay > float64(p.MaxDelay) {
		finalDelay = float64(p.MaxDelay)
	}

	return time.Duration(finalDelay)
}

// RetryManager handles the requeueing of jobs after a delay
type RetryManager struct {
	policy *RetryPolicy
	queue  jobs.Queue
	repo   jobs.Repository
}

func NewRetryManager(baseDelay, maxDelay time.Duration, queue jobs.Queue, repo jobs.Repository) *RetryManager {
	return &RetryManager{
		policy: &RetryPolicy{
			BaseDelay: baseDelay,
			MaxDelay:  maxDelay,
		},
		queue: queue,
		repo:  repo,
	}
}

// ScheduleRetry updates the job status to Scheduled and sets the next run time
// to the calculated delay. The background Scheduler will pick it up and re-enqueue it.
func (rm *RetryManager) ScheduleRetry(ctx context.Context, job *models.Job, errStr string) error {
	// Calculate delay based on the number of attempts already made
	delay := rm.policy.CalculateDelay(job.Attempts)
	nextRunAt := time.Now().UTC().Add(delay)

	// Update PostgreSQL state: set back to scheduled, save the error and next execution time
	if err := rm.repo.UpdateStatusRetry(ctx, job.ID, errStr, nextRunAt); err != nil {
		return fmt.Errorf("failed to update repository to retry state: %w", err)
	}

	logger.Info("Job scheduled for retry", "job_id", job.ID, "delay", delay, "next_run_at", nextRunAt)

	return nil
}
