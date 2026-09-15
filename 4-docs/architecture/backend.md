# Backend Architecture & Database Design (Phase 2)

## Architectural Overview

The Distributed Job Queue backend is constructed using a clean, layered Go architecture designed for high throughput, maintainability, and zero global mutable state.

```
HTTP Request (Angular Frontend or API Client)
     │
     ▼
Chi HTTP Router (2-server/internal/api/routes)
     │
     ├── Middlewares (Request ID, Structured Logger, Panic Recovery, CORS)
     │
     ▼
HTTP Handlers (2-server/internal/api/handlers)
     │
     ▼
Service Layer (2-server/internal/jobs/service.go)
     │
     ▼
Repository Interface (2-server/internal/jobs/repository.go)
     │
     ├── PostgresRepository (pgxpool -> PostgreSQL Database)
     └── MemoryRepository (Thread-safe fallback for local testing)
```

---

## Data Schema

### `jobs` Table Schema

```sql
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
```

### Database Index Strategy

- `idx_jobs_status`: Accelerates filtering by status (`queued`, `processing`, `completed`, `failed`).
- `idx_jobs_priority`: Accelerates priority sorting and filtering (`low`, `medium`, `high`, `critical`).
- `idx_jobs_type`: Speeds up job filtering by workload namespace.
- `idx_jobs_created_at`: Optimizes reverse-chronological pagination.
- `idx_jobs_scheduled_at`: Partial index optimizing scheduled job lookup for future queue workers.

---

## Middlewares & Observability

1. **`RequestID` Middleware**: Assigns a unique UUID to every incoming HTTP request (`X-Request-ID` header and context).
2. **`Logger` Middleware**: Logs structured attributes (`request_id`, `method`, `path`, `status`, `duration_ms`) using Go's `log/slog`.
3. **`Recovery` Middleware**: Catches runtime panics, logs stack traces, and returns clean 500 JSON error envelopes.
4. **`CORS` Middleware**: Configured to permit cross-origin requests from `http://localhost:4200` (Angular development server).

---

## Graceful Shutdown Sequence

When a termination signal (`SIGINT` or `SIGTERM`) is received:
1. The server stops accepting new incoming HTTP connections.
2. Active HTTP requests are given up to 10 seconds to complete cleanly (`server.Shutdown(ctx)`).
3. The PostgreSQL connection pool (`pgxpool.Pool`) is closed cleanly.
4. The process exits with code 0.
