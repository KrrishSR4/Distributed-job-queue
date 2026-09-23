package workers

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/api/websocket"
	"github.com/KrrishSR4/Distributed-job-queue/server/internal/jobs"
	"github.com/KrrishSR4/Distributed-job-queue/server/internal/metrics"
	"github.com/KrrishSR4/Distributed-job-queue/server/internal/models"
	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/logger"
)

type Worker struct {
	id         string
	queue      jobs.Queue
	repo       jobs.Repository
	processor  JobProcessor
	retryMgr   *RetryManager
	jobTimeout time.Duration
	pub        websocket.EventPublisher
}

func NewWorker(id string, queue jobs.Queue, repo jobs.Repository, processor JobProcessor, retryMgr *RetryManager, jobTimeout time.Duration, pub websocket.EventPublisher) *Worker {
	if pub == nil {
		pub = &websocket.NoopEventPublisher{}
	}
	return &Worker{
		id:         id,
		queue:      queue,
		repo:       repo,
		processor:  processor,
		retryMgr:   retryMgr,
		jobTimeout: jobTimeout,
		pub:        pub,
	}
}

func (w *Worker) Start(ctx context.Context) {
	logger.Info("Worker started", "worker_id", w.id)
	metrics.WorkersActive.Inc()
	defer metrics.WorkersActive.Dec()

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
			metrics.WorkerErrorsTotal.Inc()
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

	if job.Status == models.StatusCancelled {
		logger.Info("Cancelled job skipped by worker", "worker_id", w.id, "job_id", payload.JobID)
		return
	}

	startedAt := time.Now().UTC()
	if err := w.repo.UpdateStatusProcessing(ctx, job.ID, w.id, startedAt); err != nil {
		if errors.Is(err, jobs.ErrJobNotQueued) {
			logger.Info("Job no longer queued (possibly cancelled), skipping", "worker_id", w.id, "job_id", job.ID)
			return
		}
		logger.Error("Failed to update job status to processing", "worker_id", w.id, "job_id", job.ID, "error", err)
		return
	}
	job.WorkerID = &w.id
	job.StartedAt = &startedAt

	w.pub.Publish(websocket.Event{
		Type:      websocket.EventJobProcessing,
		JobID:     job.ID,
		Timestamp: time.Now().UTC(),
		Data: map[string]string{
			"status": string(models.StatusProcessing),
		},
	})

	metrics.JobsProcessing.Inc()
	defer metrics.JobsProcessing.Dec()

	logger.Info("Job processing started", "worker_id", w.id, "job_id", job.ID, "job_type", job.Type)

	timeoutCtx, cancel := context.WithTimeout(ctx, w.jobTimeout)
	defer cancel()

	procErr := func() (err error) {
		defer func() {
			if r := recover(); r != nil {
				err = fmt.Errorf("panic during job execution: %v", r)
				logger.Error("Job processing panicked", "worker_id", w.id, "job_id", job.ID, "panic", r)
			}
		}()
		return w.processor.Process(timeoutCtx, job, w.id)
	}()

	// If context was cancelled due to timeout, ensure procErr reflects that
	if timeoutCtx.Err() == context.DeadlineExceeded {
		procErr = fmt.Errorf("job execution timed out after %s", w.jobTimeout.String())
	}

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
				metrics.WorkerErrorsTotal.Inc()
			} else {
				metrics.JobsRetriedTotal.WithLabelValues(string(job.Type)).Inc()
			}
		} else {
			metrics.JobsFailedTotal.WithLabelValues(string(job.Type)).Inc()
			if err := w.repo.UpdateStatusFailed(ctx, job.ID, failedAt, errStr); err != nil {
				logger.Error("Failed to update job status to failed", "worker_id", w.id, "job_id", job.ID, "error", err)
				metrics.WorkerErrorsTotal.Inc()
			}

			w.pub.Publish(websocket.Event{
				Type:      websocket.EventJobFailed,
				JobID:     job.ID,
				Timestamp: time.Now().UTC(),
				Data: map[string]string{
					"status": string(models.StatusFailed),
					"error":  errStr,
				},
			})

			logger.Error("Job failed (max attempts reached)",
				"worker_id", w.id,
				"job_id", job.ID,
				"job_type", job.Type,
				"duration", duration.String(),
				"error", errStr,
			)

			dlqPayload := &models.DLQPayload{
				JobID:       job.ID,
				Type:        job.Type,
				Attempts:    job.Attempts,
				MaxAttempts: job.MaxAttempts,
				FailedAt:    failedAt,
				Reason:      errStr,
				WorkerID:    w.id,
			}

			if err := w.queue.DeadLetter(ctx, dlqPayload); err != nil {
				logger.Error("Failed to enqueue job to Redis DLQ",
					"worker_id", w.id,
					"job_id", job.ID,
					"attempts", job.Attempts,
					"max_attempts", job.MaxAttempts,
					"reason", errStr,
					"error", err,
				)
				metrics.WorkerErrorsTotal.Inc()
			} else {
				metrics.JobsDLQTotal.WithLabelValues(string(job.Type)).Inc()
				logger.Info("Job moved to Dead Letter Queue (DLQ)",
					"worker_id", w.id,
					"job_id", job.ID,
					"attempts", job.Attempts,
					"max_attempts", job.MaxAttempts,
					"reason", errStr,
				)

				w.pub.Publish(websocket.Event{
					Type:      websocket.EventJobDLQ,
					JobID:     job.ID,
					Timestamp: time.Now().UTC(),
					Data: map[string]string{
						"status": string(models.StatusFailed),
						"error":  errStr,
					},
				})
			}
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

		w.pub.Publish(websocket.Event{
			Type:      websocket.EventJobCompleted,
			JobID:     job.ID,
			Timestamp: time.Now().UTC(),
			Data: map[string]string{
				"status": string(models.StatusCompleted),
			},
		})
		metrics.JobsCompletedTotal.WithLabelValues(string(job.Type)).Inc()
	}

	statusStr := "success"
	if procErr != nil {
		statusStr = "error"
	}
	metrics.JobProcessingDuration.WithLabelValues(string(job.Type), statusStr).Observe(duration.Seconds())
}
