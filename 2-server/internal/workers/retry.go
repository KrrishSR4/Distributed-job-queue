package workers

import (
	"context"
	"fmt"
	"math"
	"math/rand"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/jobs"
	"github.com/KrrishSR4/Distributed-job-queue/server/internal/models"
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

// ScheduleRetry updates the job status to Retry (queued) and schedules it to be re-enqueued
// after the calculated delay. This method is non-blocking.
func (rm *RetryManager) ScheduleRetry(ctx context.Context, job *models.Job, errStr string) error {
	// Calculate delay based on the number of attempts already made
	delay := rm.policy.CalculateDelay(job.Attempts)

	// Update PostgreSQL state: set back to queued, save the error
	if err := rm.repo.UpdateStatusRetry(ctx, job.ID, errStr); err != nil {
		return fmt.Errorf("failed to update repository to retry state: %w", err)
	}

	// Schedule non-blocking requeue
	go func() {
		// Wait for the delay or context cancellation
		select {
		case <-time.After(delay):
			// Proceed to enqueue
		case <-ctx.Done():
			// Server shutting down, we skip enqueue.
			// The job remains in 'queued' state in DB, so it will be picked up on restart
			// if we implement a startup job-recovery, or it just waits.
			return
		}

		// Background context for enqueueing in case the original ctx was cancelled during sleep
		// (though we handled that above, it's safer for the actual operation).
		enqueueCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		// Fetch the latest state of the job to ensure it hasn't been cancelled
		latestJob, err := rm.repo.GetByID(enqueueCtx, job.ID)
		if err == nil && latestJob != nil && latestJob.Status == models.StatusCancelled {
			fmt.Printf("[RetryManager] job %s was cancelled before retry execution, skipping enqueue\n", job.ID)
			return
		}

		if err := rm.queue.Enqueue(enqueueCtx, job); err != nil {
			// If we fail to enqueue, it's stuck in DB as 'queued' but not in Redis.
			// In a robust system, a periodic "sweeper" would find 'queued' jobs older than X
			// and re-enqueue them. For now, we log the error.
			fmt.Printf("[RetryManager] failed to re-enqueue job %s: %v\n", job.ID, err)
		} else {
			fmt.Printf("[RetryManager] successfully re-enqueued job %s after %v\n", job.ID, delay)
		}
	}()

	return nil
}
