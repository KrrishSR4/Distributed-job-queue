package database

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/logger"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Database struct {
	Pool *pgxpool.Pool
}

func NewPostgresPool(ctx context.Context, databaseURL string) (*Database, error) {
	config, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		return nil, fmt.Errorf("unable to parse database config: %w", err)
	}

	config.MaxConns = 25
	config.MinConns = 5
	config.MaxConnLifetime = 30 * time.Minute
	config.MaxConnIdleTime = 5 * time.Minute

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		return nil, fmt.Errorf("unable to create connection pool: %w", err)
	}

	pingCtx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	if err := pool.Ping(pingCtx); err != nil {
		logger.Warn("PostgreSQL ping failed (database may be offline or starting): %v", err)
		return &Database{Pool: pool}, nil
	}

	logger.Info("Successfully connected to PostgreSQL database")
	db := &Database{Pool: pool}
	if err := db.AutoMigrate(ctx); err != nil {
		logger.Warn("Database migration auto-run failed: %v", err)
	}
	return db, nil
}

const defaultJobsTableMigrationSQL = `
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}',
    priority VARCHAR(50) NOT NULL DEFAULT 'medium',
    status VARCHAR(50) NOT NULL DEFAULT 'queued',
    attempts INT NOT NULL DEFAULT 0,
    max_attempts INT NOT NULL DEFAULT 3,
    scheduled_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ NULL,
    completed_at TIMESTAMPTZ NULL,
    failed_at TIMESTAMPTZ NULL,
    error TEXT NULL,
    worker_id VARCHAR(255) NULL
);

CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_priority ON jobs(priority);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_scheduled_at ON jobs(scheduled_at) WHERE scheduled_at IS NOT NULL;
`

func (db *Database) AutoMigrate(ctx context.Context) error {
	if db == nil || db.Pool == nil {
		return fmt.Errorf("cannot run migrations on nil database pool")
	}

	paths := []string{
		"migrations/000001_create_jobs_table.up.sql",
		"2-server/migrations/000001_create_jobs_table.up.sql",
		"../migrations/000001_create_jobs_table.up.sql",
		"../../migrations/000001_create_jobs_table.up.sql",
	}

	var sqlScript string
	for _, p := range paths {
		if content, err := os.ReadFile(p); err == nil {
			sqlScript = string(content)
			break
		}
	}

	if sqlScript == "" {
		sqlScript = defaultJobsTableMigrationSQL
	}

	migCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	_, err := db.Pool.Exec(migCtx, sqlScript)
	if err != nil {
		return fmt.Errorf("failed to run jobs migration: %w", err)
	}

	logger.Info("Successfully verified/applied database migration for jobs table")
	return nil
}

func (db *Database) IsHealthy(ctx context.Context) bool {
	if db == nil || db.Pool == nil {
		return false
	}
	pingCtx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()
	return db.Pool.Ping(pingCtx) == nil
}

func (db *Database) Close() {
	if db != nil && db.Pool != nil {
		db.Pool.Close()
		logger.Info("PostgreSQL connection pool closed")
	}
}
