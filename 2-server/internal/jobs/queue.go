package jobs

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"sync"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/models"
	appRedis "github.com/KrrishSR4/Distributed-job-queue/server/internal/redis"
	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/logger"
	"github.com/redis/go-redis/v9"
)

type Queue interface {
	Enqueue(ctx context.Context, job *models.Job) error
	Dequeue(ctx context.Context, timeout time.Duration) (*QueuePayload, error)
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

func (rq *RedisQueue) Dequeue(ctx context.Context, timeout time.Duration) (*QueuePayload, error) {
	if rq == nil || rq.client == nil || rq.client.RDB == nil {
		return nil, fmt.Errorf("redis client unavailable")
	}

	res, err := rq.client.RDB.BRPop(ctx, timeout, rq.key).Result()
	if err != nil {
		if errors.Is(err, redis.Nil) {
			return nil, nil
		}
		return nil, err
	}

	if len(res) < 2 {
		return nil, fmt.Errorf("unexpected BRPOP result format")
	}

	rawPayload := res[1]
	var payload QueuePayload
	if err := json.Unmarshal([]byte(rawPayload), &payload); err != nil {
		return nil, fmt.Errorf("malformed queue payload JSON: %w", err)
	}

	return &payload, nil
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

func (mq *MemoryQueue) Dequeue(ctx context.Context, timeout time.Duration) (*QueuePayload, error) {
	mq.mu.Lock()
	if len(mq.Enqueued) > 0 {
		payload := mq.Enqueued[0]
		mq.Enqueued = mq.Enqueued[1:]
		mq.mu.Unlock()
		return payload, nil
	}
	mq.mu.Unlock()

	select {
	case <-ctx.Done():
		return nil, ctx.Err()
	case <-time.After(timeout):
		return nil, nil
	}
}
