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

func NewWorkerPool(workerCount int, repo jobs.Repository, queue jobs.Queue, processor JobProcessor, delays ...time.Duration) *WorkerPool {
	if workerCount <= 0 {
		workerCount = 3
	}

	baseDelay := 1 * time.Second
	maxDelay := 30 * time.Second
	if len(delays) > 0 && delays[0] > 0 {
		baseDelay = delays[0]
	}
	if len(delays) > 1 && delays[1] > 0 {
		maxDelay = delays[1]
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
		worker := NewWorker(workerID, queue, repo, processor, retryMgr)
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
