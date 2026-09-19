package workers

import (
	"context"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/jobs"
	"github.com/KrrishSR4/Distributed-job-queue/server/internal/models"
)

type concurrencyLimitTrackingProcessor struct {
	activeJobs int32
	maxActive  int32
	mu         sync.Mutex

	// waitBlock allows us to intentionally block jobs to test max concurrency
	waitBlock chan struct{}
}

func (p *concurrencyLimitTrackingProcessor) Process(ctx context.Context, job *models.Job, workerID string) error {
	current := atomic.AddInt32(&p.activeJobs, 1)
	defer atomic.AddInt32(&p.activeJobs, -1)

	p.mu.Lock()
	if current > p.maxActive {
		p.maxActive = current
	}
	p.mu.Unlock()

	// Block until unblocked by the test
	select {
	case <-p.waitBlock:
	case <-ctx.Done():
	}

	return nil
}

func TestWorkerConcurrencyLimit(t *testing.T) {
	repo := jobs.NewMemoryRepository()
	queue := jobs.NewMemoryQueue()
	ctx := context.Background()
	
	// Create processor that blocks jobs manually
	processor := &concurrencyLimitTrackingProcessor{
		waitBlock: make(chan struct{}),
	}
	
	workerCount := 3
	pool := NewWorkerPool(workerCount, repo, queue, processor, 10*time.Millisecond, 20*time.Millisecond, 50*time.Millisecond, nil)
	
	pool.Start()
	
	// Submit 20 jobs
	totalJobs := 20
	for i := 0; i < totalJobs; i++ {
		job := &models.Job{
			ID:          "job-" + string(rune(i)),
			Type:        "test",
			Status:      models.StatusQueued,
			Attempts:    0,
			MaxAttempts: 3,
			CreatedAt:   time.Now().UTC(),
		}
		_ = repo.Create(ctx, job)
		_ = queue.Enqueue(ctx, job)
	}

	// Wait a moment for workers to pick up jobs
	time.Sleep(200 * time.Millisecond)

	// Check max concurrency (must not exceed WORKER_COUNT)
	processor.mu.Lock()
	maxActive := processor.maxActive
	currentActive := processor.activeJobs
	processor.mu.Unlock()

	if maxActive > int32(workerCount) {
		t.Errorf("expected max active jobs <= %d, got %d", workerCount, maxActive)
	}
	
	if currentActive != int32(workerCount) {
		t.Errorf("expected exactly %d workers to be busy, got %d", workerCount, currentActive)
	}
	
	// Unblock all workers
	close(processor.waitBlock)
	
	// Let all jobs finish
	time.Sleep(200 * time.Millisecond)
	
	pool.Stop()
	
	// Ensure everything processed
	processor.mu.Lock()
	finalActive := processor.activeJobs
	processor.mu.Unlock()

	if finalActive != 0 {
		t.Errorf("expected 0 active jobs after completion, got %d", finalActive)
	}
}
