package workers

import (
	"context"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/api/websocket"
	"github.com/KrrishSR4/Distributed-job-queue/server/internal/jobs"
	"github.com/KrrishSR4/Distributed-job-queue/server/internal/models"
	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/logger"
)

type Scheduler struct {
	repo             jobs.Repository
	queue            jobs.Queue
	pollInterval     time.Duration
	recoveryInterval time.Duration
	staleTimeout     time.Duration
	batchSize        int
	stopChan         chan struct{}
	pub              websocket.EventPublisher
}

func NewScheduler(repo jobs.Repository, queue jobs.Queue, pollInterval, recoveryInterval, staleTimeout time.Duration, batchSize int, pub websocket.EventPublisher) *Scheduler {
	if pub == nil {
		pub = &websocket.NoopEventPublisher{}
	}

	return &Scheduler{
		repo:             repo,
		queue:            queue,
		pollInterval:     pollInterval,
		recoveryInterval: recoveryInterval,
		staleTimeout:     staleTimeout,
		batchSize:        batchSize,
		stopChan:         make(chan struct{}),
		pub:              pub,
	}
}

func (s *Scheduler) Start(ctx context.Context) {
	ticker := time.NewTicker(s.pollInterval)
	defer ticker.Stop()

	recoveryTicker := time.NewTicker(s.recoveryInterval)
	defer recoveryTicker.Stop()

	logger.Info("Job Scheduler & Recovery started", "poll_interval", s.pollInterval, "recovery_interval", s.recoveryInterval, "stale_timeout", s.staleTimeout, "batch_size", s.batchSize)

	for {
		select {
		case <-ctx.Done():
			logger.Info("Job Scheduler & Recovery stopping on context cancellation")
			return
		case <-s.stopChan:
			logger.Info("Job Scheduler & Recovery stopping via explicit stop")
			return
		case <-ticker.C:
			s.processDueJobs(ctx)
		case <-recoveryTicker.C:
			s.recoverStaleJobs(ctx)
		}
	}
}

func (s *Scheduler) Stop() {
	close(s.stopChan)
}

func (s *Scheduler) processDueJobs(ctx context.Context) {
	now := time.Now().UTC()

	dueJobs, err := s.repo.EnqueueDueScheduledJobs(ctx, now, s.batchSize)
	if err != nil {
		logger.Error("Scheduler failed to fetch due jobs", "error", err)
		return
	}

	if len(dueJobs) > 0 {
		logger.Debug("Scheduler fetched due jobs", "count", len(dueJobs))
	}

	for _, job := range dueJobs {
		if err := s.queue.Enqueue(ctx, job); err != nil {
			logger.Error("Scheduler failed to enqueue due job to Redis", "job_id", job.ID, "error", err)
		} else {
			logger.Info("Scheduler enqueued due job", "job_id", job.ID, "type", job.Type)

			s.pub.Publish(websocket.Event{
				Type:      websocket.EventJobScheduled,
				JobID:     job.ID,
				Timestamp: time.Now().UTC(),
				Data: map[string]string{
					"type": job.Type,
				},
			})
		}
	}
}

func (s *Scheduler) recoverStaleJobs(ctx context.Context) {
	staleBefore := time.Now().UTC().Add(-s.staleTimeout)

	staleJobs, err := s.repo.RecoverStaleJobs(ctx, staleBefore, s.batchSize)
	if err != nil {
		logger.Error("Scheduler failed to recover stale jobs", "error", err)
		return
	}

	if len(staleJobs) > 0 {
		logger.Info("Scheduler recovered stale jobs", "count", len(staleJobs))
	}

	for _, job := range staleJobs {
		if err := s.queue.Enqueue(ctx, job); err != nil {
			logger.Error("Scheduler failed to re-enqueue recovered stale job", "job_id", job.ID, "error", err)
		} else {
			logger.Info("Scheduler successfully re-enqueued recovered stale job", "job_id", job.ID, "type", job.Type)

			s.pub.Publish(websocket.Event{
				Type:      websocket.EventJobTimeout,
				JobID:     job.ID,
				Timestamp: time.Now().UTC(),
				Data: map[string]string{
					"status": string(models.StatusScheduled),
				},
			})

			workerID := ""
			if job.WorkerID != nil {
				workerID = *job.WorkerID
			}
			s.pub.Publish(websocket.Event{
				Type:      websocket.EventJobRecovered,
				JobID:     job.ID,
				Timestamp: time.Now().UTC(),
				Data: map[string]string{
					"worker_id": workerID,
				},
			})
		}
	}
}
