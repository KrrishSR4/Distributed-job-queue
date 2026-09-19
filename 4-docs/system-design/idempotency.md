# Idempotency & Duplicate Job Handling

In distributed systems, it is difficult to guarantee exactly-once message delivery or exactly-once HTTP requests.
- **Duplicate Requests**: A client might experience a network timeout after sending a request but before receiving the response. It naturally retries the request, potentially creating a duplicate job.
- **Duplicate Queue Delivery**: A message broker (like Redis or RabbitMQ) might deliver the same message to multiple workers due to connection drops, visibility timeouts, or crash recovery scenarios.

To ensure system correctness, we must make both **job creation** and **job processing** idempotent.

## 1. Idempotent Job Creation (Idempotency-Key)
Clients can optionally provide an `Idempotency-Key` header when creating a job. This key represents a single, logical job request.

```http
POST /api/v1/jobs
Idempotency-Key: abc-123
```

### Mechanism: PostgreSQL UNIQUE Constraint
Instead of relying on application-level locks (which are susceptible to race conditions), we use a database-level `UNIQUE` constraint on the `idempotency_key` column in PostgreSQL.

**Flow:**
1. Request arrives with `Idempotency-Key: abc-123`.
2. Go API attempts to `INSERT ... ON CONFLICT (idempotency_key) DO NOTHING`.
3. If the insert succeeds, a new job is created, enqueued, and returned.
4. If the insert affects 0 rows, it means the key already exists!
5. The API catches this, queries the existing job by the `idempotency_key`, and returns the existing job.
6. **No duplicate row is created. No duplicate Redis message is enqueued. No duplicate WebSocket lifecycle events are fired.**

Because PostgreSQL treats `NULL` values as distinct, requests without an idempotency key can still be inserted without violating the unique constraint.

## 2. Duplicate Queue Delivery Protection
Because Redis is used as a transport layer and jobs can be recovered by the `Scheduler`, the same job could theoretically be delivered to two workers.

### Mechanism: Safe State Transitions
We never blindly overwrite the state of a job just because a worker receives a queue message. We rely on PostgreSQL conditional updates as atomic locks.

- **Starting Processing**: When a worker starts processing a job, it executes:
  `UPDATE jobs SET status = 'processing' WHERE id = ? AND status = 'queued'`
  If a duplicate worker attempts this, 0 rows are updated (returning `ErrJobNotQueued`), and the duplicate worker safely drops the job.
- **Completing/Failing a Job**: When a worker finishes, it executes:
  `UPDATE jobs SET status = 'completed' WHERE id = ? AND status NOT IN ('completed', 'failed', 'cancelled')`
  This ensures that if a zombie worker eventually completes a job that was already recovered and marked as terminal (or processed by someone else), it cannot corrupt the terminal state.

## 3. Retries and Recovery
Retries and stuck-job recovery work seamlessly with this design.
- **Retries**: Retrying a failed attempt keeps the **same Job ID** and updates the `attempts` counter. It does not create a new job row, keeping the idempotency key context intact.
- **Timeout Recovery**: If a worker crashes while a job is in `processing`, the scheduler recovers it back to `queued` (keeping the same Job ID). When a new worker picks it up, the conditional `status = 'queued'` lock works perfectly.

## Summary
By using a **PostgreSQL UNIQUE constraint** for job creation and **conditional updates** for state transitions, we achieve robust idempotency without requiring distributed locking (like Redis Redlock) or complex duplicate-checking services.
