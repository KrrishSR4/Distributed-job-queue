package workers

import (
	"context"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/jobs"
	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/logger"
)

type Scheduler struct {
	repo         jobs.Repository
	queue        jobs.Queue
	pollInterval time.Duration
	batchSize    int
	stopChan     chan struct{}
}

func NewScheduler(repo jobs.Repository, queue jobs.Queue, pollInterval time.Duration, batchSize int) *Scheduler {
	return &Scheduler{
		repo:         repo,
		queue:        queue,
		pollInterval: pollInterval,
		batchSize:    batchSize,
		stopChan:     make(chan struct{}),
	}
}

func (s *Scheduler) Start(ctx context.Context) {
	ticker := time.NewTicker(s.pollInterval)
	defer ticker.Stop()

	logger.Info("Job Scheduler started", "poll_interval", s.pollInterval, "batch_size", s.batchSize)

	for {
		select {
		case <-ctx.Done():
			logger.Info("Job Scheduler stopping on context cancellation")
			return
		case <-s.stopChan:
			logger.Info("Job Scheduler stopping via explicit stop")
			return
		case <-ticker.C:
			s.processDueJobs(ctx)
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
		}
	}
}
