package workers

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/jobs"
	"github.com/KrrishSR4/Distributed-job-queue/server/internal/api/websocket"
	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/logger"
)

type WorkerPool struct {
	workerCount int
	repo        jobs.Repository
	queue       jobs.Queue
	processor   JobProcessor
	retryMgr    *RetryManager
	jobTimeout  time.Duration
	workers     []*Worker
	ctx         context.Context
	cancel      context.CancelFunc
	wg          sync.WaitGroup
	pub         websocket.EventPublisher
}

func NewWorkerPool(
	workerCount int,
	instanceID string,
	repo jobs.Repository,
	queue jobs.Queue,
	processor JobProcessor,
	retryBaseDelay time.Duration,
	retryMaxDelay time.Duration,
	jobTimeout time.Duration,
	pub websocket.EventPublisher,
) *WorkerPool {
	if workerCount <= 0 {
		workerCount = 3
	}
	if retryBaseDelay <= 0 {
		retryBaseDelay = 1 * time.Second
	}
	if retryMaxDelay <= 0 {
		retryMaxDelay = 30 * time.Second
	}
	if jobTimeout <= 0 {
		jobTimeout = 30 * time.Second
	}
	if pub == nil {
		pub = &websocket.NoopEventPublisher{}
	}

	ctx, cancel := context.WithCancel(context.Background())
	retryMgr := NewRetryManager(retryBaseDelay, retryMaxDelay, queue, repo, pub)

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
		workerID := fmt.Sprintf("%s-worker-%d", instanceID, i)
		worker := NewWorker(workerID, queue, repo, processor, retryMgr, jobTimeout, pub)
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
