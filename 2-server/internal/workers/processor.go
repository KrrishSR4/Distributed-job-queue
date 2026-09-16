package workers

import (
	"context"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/models"
	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/logger"
)

type JobProcessor interface {
	Process(ctx context.Context, job *models.Job, workerID string) error
}

type DemoProcessor struct {
	ProcessDelay time.Duration
}

func NewDemoProcessor(delay time.Duration) *DemoProcessor {
	return &DemoProcessor{
		ProcessDelay: delay,
	}
}

func (p *DemoProcessor) Process(ctx context.Context, job *models.Job, workerID string) error {
	logger.Info("Processing job",
		"job_id", job.ID,
		"worker_id", workerID,
		"type", job.Type,
		"priority", job.Priority,
	)

	if p.ProcessDelay > 0 {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-time.After(p.ProcessDelay):
		}
	}

	return nil
}
