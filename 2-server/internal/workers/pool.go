package workers

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/jobs"
	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/logger"
)

type WorkerPool struct {
	workerCount int
	queue       jobs.Queue
	repo        jobs.Repository
	processor   JobProcessor
	workers     []*Worker
	wg          sync.WaitGroup
	ctx         context.Context
	cancel      context.CancelFunc
}

func NewWorkerPool(workerCount int, repo jobs.Repository, queue jobs.Queue, processor JobProcessor, baseDelay, maxDelay, jobTimeout time.Duration) *WorkerPool {
	if workerCount <= 0 {
		workerCount = 3
	}
	if baseDelay <= 0 {
		baseDelay = 1 * time.Second
	}
	if maxDelay <= 0 {
		maxDelay = 30 * time.Second
	}
	if jobTimeout <= 0 {
		jobTimeout = 30 * time.Second
	}

	ctx, cancel := context.WithCancel(context.Background())
	retryMgr := NewRetryManager(baseDelay, maxDelay, queue, repo)

	pool := &WorkerPool{
		workerCount: workerCount,
		repo:        repo,
		queue:       queue,
		processor:   processor,
		workers:     make([]*Worker, 0, workerCount),
		ctx:         ctx,
		cancel:      cancel,
	}

	for i := 1; i <= workerCount; i++ {
		workerID := fmt.Sprintf("worker-%d", i)
		worker := NewWorker(workerID, queue, repo, processor, retryMgr, jobTimeout)
		pool.workers = append(pool.workers, worker)
	}

	return pool
}

func (p *WorkerPool) Start() {
	logger.Info("Worker pool starting", "worker_count", p.workerCount)

	for _, w := range p.workers {
		p.wg.Add(1)
		go func(worker *Worker) {
			defer p.wg.Done()
			worker.Start(p.ctx)
		}(w)
	}
}

func (p *WorkerPool) Stop() {
	logger.Info("Worker pool stopping...")
	p.cancel()
	p.wg.Wait()
	logger.Info("Worker pool shutdown complete")
}

func (p *WorkerPool) WorkerCount() int {
	return p.workerCount
}
