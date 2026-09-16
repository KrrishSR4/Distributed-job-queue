# Worker Pool Architecture

## Overview
Phase 3.3 introduces a production-style, concurrent **Go Worker Pool** into the Distributed Job Queue backend architecture. Workers consume job payloads asynchronously from Redis (`jobs:queue`) and manage job execution lifecycles while reflecting real-time state changes in PostgreSQL.

```
                    Go API
                       │
                       ├──→ PostgreSQL
                       │
                       └──→ Redis Queue
                              │
                              ▼
                         jobs:queue
                              │
                    ┌─────────┼─────────┐
                    ▼         ▼         ▼
                 Worker 1  Worker 2  Worker 3
                    │         │         │
                    └─────────┼─────────┘
                              ▼
                         Job Processor
                              │
                              ▼
                         PostgreSQL
```

---

## Key Features

### 1. Configurable Concurrency
- Worker pool size is configurable via the `WORKER_COUNT` environment variable (default: `3`).
- Goroutines are bounded to the configured worker count to prevent unbounded goroutine creation.

### 2. Redis Consumption Mechanism
- Workers block on Redis queue (`jobs:queue`) using `BRPOP` operations with configurable timeouts (e.g. `2s`).
- Efficient blocking pops eliminate busy polling (`for { check; sleep; }`).

### 3. Unique Worker Identification
- Each worker instance receives a human-readable identifier (e.g., `worker-1`, `worker-2`, `worker-3`).
- When a worker picks up a job, its `worker_id` is recorded in PostgreSQL.

### 4. Job Lifecycle & PostgreSQL State Flow
1. **Dequeue**: Worker receives JSON payload `{ "job_id": "...", "type": "...", "priority": "..." }`.
2. **State: Processing**: Worker fetches full job record from PostgreSQL and updates:
   - `status = 'processing'`
   - `started_at = NOW()`
   - `worker_id = 'worker-N'`
3. **Execution**: Worker delegates to `JobProcessor.Process(ctx, job, worker_id)`.
4. **State Transition**:
   - **Success**: Status updated to `completed`, `completed_at` timestamp recorded.
   - **Failure**: Status updated to `failed`, `failed_at` timestamp and error string recorded.

### 5. Graceful Shutdown
- On `SIGINT` or `SIGTERM`, the API server stops accepting HTTP traffic and triggers `WorkerPool.Stop()`.
- Context cancellation terminates Redis wait loops while `sync.WaitGroup` waits for currently running job executions to complete.

---

## Current Limitations & Explicit Non-Goals (Phase 3.3 Scope)
- **Retry & Exponential Backoff**: Failed jobs remain in `failed` status without automatic re-queueing (planned for Phase 4).
- **Dead Letter Queue (DLQ)**: Malformed or unprocessable messages are logged but not moved to DLQ (planned for Phase 4).
- **Scheduler & Priority Sorting**: Jobs are consumed FIFO from Redis; advanced priority scheduling or cron features will be added in Phase 5.
- **WebSocket Notifications**: Real-time frontend events will be added in Phase 6.
