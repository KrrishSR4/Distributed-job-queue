package workers

import (
	"context"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/jobs"
	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/logger"
)

type Worker struct {
	id        string
	queue     jobs.Queue
	repo      jobs.Repository
	processor JobProcessor
	retryMgr  *RetryManager
}

func NewWorker(id string, queue jobs.Queue, repo jobs.Repository, processor JobProcessor, retryMgr *RetryManager) *Worker {
	return &Worker{
		id:        id,
		queue:     queue,
		repo:      repo,
		processor: processor,
		retryMgr:  retryMgr,
	}
}

func (w *Worker) Start(ctx context.Context) {
	logger.Info("Worker started", "worker_id", w.id)

	for {
		select {
		case <-ctx.Done():
			logger.Info("Worker stopping on shutdown", "worker_id", w.id)
			return
		default:
		}

		payload, err := w.queue.Dequeue(ctx, 2*time.Second)
		if err != nil {
			if ctx.Err() != nil {
				logger.Info("Worker stopping on context cancellation", "worker_id", w.id)
				return
			}
			logger.Error("Error dequeuing job payload", "worker_id", w.id, "error", err)
			time.Sleep(500 * time.Millisecond)
			continue
		}

		if payload == nil {
			continue
		}

		w.processJobPayload(ctx, payload)
	}
}

func (w *Worker) processJobPayload(ctx context.Context, payload *jobs.QueuePayload) {
	if payload.JobID == "" {
		logger.Error("Received queue payload with empty job_id", "worker_id", w.id)
		return
	}

	logger.Info("Job received", "worker_id", w.id, "job_id", payload.JobID, "type", payload.Type)

	job, err := w.repo.GetByID(ctx, payload.JobID)
	if err != nil {
		logger.Error("Failed to fetch job record from database", "worker_id", w.id, "job_id", payload.JobID, "error", err)
		return
	}

	if job == nil {
		logger.Warn("Job record not found in database", "worker_id", w.id, "job_id", payload.JobID)
		return
	}

	startedAt := time.Now().UTC()
	if err := w.repo.UpdateStatusProcessing(ctx, job.ID, w.id, startedAt); err != nil {
		logger.Error("Failed to update job status to processing", "worker_id", w.id, "job_id", job.ID, "error", err)
		return
	}
	job.WorkerID = &w.id
	job.StartedAt = &startedAt
	job.Attempts++ // manually increment local struct to match DB state

	logger.Info("Job processing started", "worker_id", w.id, "job_id", job.ID, "job_type", job.Type)

	procErr := w.processor.Process(ctx, job, w.id)
	duration := time.Since(startedAt)

	if procErr != nil {
		failedAt := time.Now().UTC()
		errStr := procErr.Error()
		
		if job.Attempts < job.MaxAttempts {
			logger.Warn("Job processing failed, scheduling retry",
				"worker_id", w.id,
				"job_id", job.ID,
				"attempt", job.Attempts,
				"max_attempts", job.MaxAttempts,
				"error", errStr,
			)
			if err := w.retryMgr.ScheduleRetry(ctx, job, errStr); err != nil {
				logger.Error("Failed to schedule job retry", "worker_id", w.id, "job_id", job.ID, "error", err)
			}
		} else {
			if err := w.repo.UpdateStatusFailed(ctx, job.ID, failedAt, errStr); err != nil {
				logger.Error("Failed to update job status to failed", "worker_id", w.id, "job_id", job.ID, "error", err)
			}
			logger.Error("Job failed (max attempts reached)",
				"worker_id", w.id,
				"job_id", job.ID,
				"job_type", job.Type,
				"duration", duration.String(),
				"error", errStr,
			)
		}
	} else {
		completedAt := time.Now().UTC()
		if err := w.repo.UpdateStatusCompleted(ctx, job.ID, completedAt); err != nil {
			logger.Error("Failed to update job status to completed", "worker_id", w.id, "job_id", job.ID, "error", err)
		}
		logger.Info("Job completed",
			"worker_id", w.id,
			"job_id", job.ID,
			"job_type", job.Type,
			"duration", duration.String(),
		)
	}
}
