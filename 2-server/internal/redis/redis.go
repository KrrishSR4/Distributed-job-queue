package redis

import (
	"context"
	"fmt"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/logger"
	"github.com/redis/go-redis/v9"
)

type Client struct {
	RDB *redis.Client
}

func NewClient(ctx context.Context, redisURL string) (*Client, error) {
	opts, err := redis.ParseURL(redisURL)
	if err != nil {
		return nil, fmt.Errorf("unable to parse redis URL: %w", err)
	}

	opts.DialTimeout = 3 * time.Second
	opts.ReadTimeout = 3 * time.Second
	opts.WriteTimeout = 3 * time.Second
	opts.PoolSize = 20

	rdb := redis.NewClient(opts)

	pingCtx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	if err := rdb.Ping(pingCtx).Err(); err != nil {
		logger.Warn("Redis connection ping failed (Redis may be offline or starting): %v", err)
		return &Client{RDB: rdb}, nil
	}

	logger.Info("Successfully connected to Redis broker", "url", opts.Addr)
	return &Client{RDB: rdb}, nil
}

func (c *Client) IsHealthy(ctx context.Context) bool {
	if c == nil || c.RDB == nil {
		return false
	}
	pingCtx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()
	return c.RDB.Ping(pingCtx).Err() == nil
}

func (c *Client) Close() {
	if c != nil && c.RDB != nil {
		if err := c.RDB.Close(); err != nil {
			logger.Error("Error closing Redis client", "error", err)
		} else {
			logger.Info("Redis client connection closed")
		}
	}
}
