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

const (
	DefaultQueueKey = "jobs:queue"
	DefaultDLQKey   = "jobs:dlq"
)

type Queue interface {
	Enqueue(ctx context.Context, job *models.Job) error
	Dequeue(ctx context.Context, timeout time.Duration) (*QueuePayload, error)
	DeadLetter(ctx context.Context, payload *models.DLQPayload) error
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
	dlqKey string
}

func NewRedisQueue(client *appRedis.Client, key string, dlqKey ...string) *RedisQueue {
	if key == "" {
		key = DefaultQueueKey
	}
	dKey := DefaultDLQKey
	if len(dlqKey) > 0 && dlqKey[0] != "" {
		dKey = dlqKey[0]
	}
	return &RedisQueue{
		client: client,
		key:    key,
		dlqKey: dKey,
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

	priority := job.Priority
	if priority == "" {
		priority = models.PriorityMedium
	}
	targetKey := fmt.Sprintf("%s:%s", rq.key, priority)

	if err := rq.client.RDB.LPush(ctx, targetKey, payloadBytes).Err(); err != nil {
		return fmt.Errorf("failed to LPUSH job to redis queue %s: %w", targetKey, err)
	}

	logger.Info("Enqueued job into Redis queue", "job_id", job.ID, "queue", targetKey, "priority", priority)
	return nil
}

func (rq *RedisQueue) Dequeue(ctx context.Context, timeout time.Duration) (*QueuePayload, error) {
	if rq == nil || rq.client == nil || rq.client.RDB == nil {
		return nil, fmt.Errorf("redis client unavailable")
	}

	keys := []string{
		fmt.Sprintf("%s:%s", rq.key, models.PriorityCritical),
		fmt.Sprintf("%s:%s", rq.key, models.PriorityHigh),
		fmt.Sprintf("%s:%s", rq.key, models.PriorityMedium),
		fmt.Sprintf("%s:%s", rq.key, models.PriorityLow),
	}

	res, err := rq.client.RDB.BRPop(ctx, timeout, keys...).Result()
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

func (rq *RedisQueue) DeadLetter(ctx context.Context, payload *models.DLQPayload) error {
	if rq == nil || rq.client == nil || rq.client.RDB == nil {
		return fmt.Errorf("redis client unavailable")
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal DLQ payload: %w", err)
	}

	if err := rq.client.RDB.LPush(ctx, rq.dlqKey, payloadBytes).Err(); err != nil {
		return fmt.Errorf("failed to LPUSH job to redis DLQ %s: %w", rq.dlqKey, err)
	}

	logger.Info("Enqueued job into Redis DLQ", "job_id", payload.JobID, "dlq_key", rq.dlqKey)
	return nil
}

type MemoryQueue struct {
	mu           sync.Mutex
	notify       chan struct{}
	Enqueued     []*QueuePayload
	DeadLettered []*models.DLQPayload
}

func NewMemoryQueue() *MemoryQueue {
	return &MemoryQueue{
		notify:       make(chan struct{}, 1000),
		Enqueued:     []*QueuePayload{},
		DeadLettered: []*models.DLQPayload{},
	}
}

func (mq *MemoryQueue) Enqueue(ctx context.Context, job *models.Job) error {
	mq.mu.Lock()
	payload := &QueuePayload{
		JobID:    job.ID,
		Type:     job.Type,
		Priority: job.Priority,
		Attempts: job.Attempts,
	}

	mq.Enqueued = append(mq.Enqueued, payload)
	mq.mu.Unlock()

	select {
	case mq.notify <- struct{}{}:
	default:
	}

	logger.Debug("Enqueued job into MemoryQueue fallback", "job_id", job.ID)
	return nil
}

func (mq *MemoryQueue) popHighestPriority() *QueuePayload {
	priorities := []models.JobPriority{
		models.PriorityCritical,
		models.PriorityHigh,
		models.PriorityMedium,
		models.PriorityLow,
	}

	for _, p := range priorities {
		for i, job := range mq.Enqueued {
			priority := job.Priority
			if priority == "" {
				priority = models.PriorityMedium
			}
			if priority == p {
				// Remove the job from the queue
				mq.Enqueued = append(mq.Enqueued[:i], mq.Enqueued[i+1:]...)
				return job
			}
		}
	}

	// Fallback (e.g. if priority is missing or unknown, pop first)
	if len(mq.Enqueued) > 0 {
		job := mq.Enqueued[0]
		mq.Enqueued = mq.Enqueued[1:]
		return job
	}

	return nil
}

func (mq *MemoryQueue) Dequeue(ctx context.Context, timeout time.Duration) (*QueuePayload, error) {
	mq.mu.Lock()
	if payload := mq.popHighestPriority(); payload != nil {
		mq.mu.Unlock()
		return payload, nil
	}
	mq.mu.Unlock()

	select {
	case <-ctx.Done():
		return nil, ctx.Err()
	case <-mq.notify:
		mq.mu.Lock()
		if payload := mq.popHighestPriority(); payload != nil {
			mq.mu.Unlock()
			return payload, nil
		}
		mq.mu.Unlock()
		return nil, nil
	case <-time.After(timeout):
		return nil, nil
	}
}

func (mq *MemoryQueue) DeadLetter(ctx context.Context, payload *models.DLQPayload) error {
	mq.mu.Lock()
	defer mq.mu.Unlock()

	mq.DeadLettered = append(mq.DeadLettered, payload)
	logger.Debug("Enqueued job into MemoryQueue DLQ fallback", "job_id", payload.JobID)
	return nil
}

func (mq *MemoryQueue) GetDeadLettered() []*models.DLQPayload {
	mq.mu.Lock()
	defer mq.mu.Unlock()

	res := make([]*models.DLQPayload, len(mq.DeadLettered))
	copy(res, mq.DeadLettered)
	return res
}
