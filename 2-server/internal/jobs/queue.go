package jobs

import (
	"context"
	"encoding/json"
	"fmt"
	"sync"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/models"
	appRedis "github.com/KrrishSR4/Distributed-job-queue/server/internal/redis"
	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/logger"
)

type Queue interface {
	Enqueue(ctx context.Context, job *models.Job) error
}

type QueuePayload struct {
	JobID    string             `json:"job_id"`
	Type     string             `json:"type"`
	Priority models.JobPriority `json:"priority"`
	Attempts int                `json:"attempts"`
}

type RedisQueue struct {
	client *appRedis.Client
	key    string
}

func NewRedisQueue(client *appRedis.Client, key string) *RedisQueue {
	if key == "" {
		key = "jobs:queue"
	}
	return &RedisQueue{
		client: client,
		key:    key,
	}
}

func (rq *RedisQueue) Enqueue(ctx context.Context, job *models.Job) error {
	if rq == nil || rq.client == nil || rq.client.RDB == nil {
		return fmt.Errorf("redis client unavailable")
	}

	payload := QueuePayload{
		JobID:    job.ID,
		Type:     job.Type,
		Priority: job.Priority,
		Attempts: job.Attempts,
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal queue payload: %w", err)
	}

	if err := rq.client.RDB.LPush(ctx, rq.key, payloadBytes).Err(); err != nil {
		return fmt.Errorf("failed to LPUSH job to redis queue %s: %w", rq.key, err)
	}

	logger.Info("Enqueued job into Redis queue", "job_id", job.ID, "queue", rq.key)
	return nil
}

type MemoryQueue struct {
	mu       sync.Mutex
	Enqueued []*QueuePayload
}

func NewMemoryQueue() *MemoryQueue {
	return &MemoryQueue{
		Enqueued: []*QueuePayload{},
	}
}

func (mq *MemoryQueue) Enqueue(ctx context.Context, job *models.Job) error {
	mq.mu.Lock()
	defer mq.mu.Unlock()

	payload := &QueuePayload{
		JobID:    job.ID,
		Type:     job.Type,
		Priority: job.Priority,
		Attempts: job.Attempts,
	}

	mq.Enqueued = append(mq.Enqueued, payload)
	logger.Debug("Enqueued job into MemoryQueue fallback", "job_id", job.ID)
	return nil
}
