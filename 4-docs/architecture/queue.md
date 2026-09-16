# Redis Job Queue Architecture (Phase 3.2)

## Overview

In Phase 3.2, Redis has been converted into the active asynchronous job queue for the Distributed Job Queue project. 

PostgreSQL remains the persistent source of truth for job metadata and execution history, while Redis acts as the high-throughput asynchronous queue.

```
Client (Postman / Angular Dashboard)
        │
        ▼
POST /api/v1/jobs
        │
        ▼
Go REST API (JobService.CreateJob)
        │
        ├── 1. Validate Payload (CreateJobRequest.Validate)
        │
        ├── 2. Persist to PostgreSQL (Repository.Create -> jobs table, status = "queued")
        │        └─► If DB Insert Fails: Return HTTP Error immediately (Zero Redis operations)
        │
        └── 3. Enqueue to Redis (Queue.Enqueue -> LPUSH jobs:queue {job_id, type, priority, attempts})
                 ├─► If Redis Enqueue Fails: Log structured error with job_id & return HTTP Error
                 └─► If Redis Enqueue Succeeds: Return HTTP 201 Created with Job object
```

---

## Queue Key & Payload Schema

### Redis Key

`jobs:queue` (Configurable via `REDIS_QUEUE_KEY` environment variable).

### Data Structure

Redis **List** using `LPUSH jobs:queue <json_payload>`.

### Compact Queue Payload JSON

```json
{
  "job_id": "61bc8ad4-b020-450b-b6f1-d586e5d900d4",
  "type": "image_processing",
  "priority": "medium",
  "attempts": 0
}
```

#### Field Specifications
| Field | Type | Description |
|---|---|---|
| `job_id` | string (UUID) | Unique identifier linking to PostgreSQL `jobs.id`. |
| `type` | string | Namespace identifier for job handler routing (e.g. `email.send`, `media.transcode`). |
| `priority` | string | Job priority (`low`, `medium`, `high`, `critical`). |
| `attempts` | integer | Execution attempt counter (starts at 0). |

---

## Failure & Idempotency Rules

1. **PostgreSQL First**: Jobs are always persisted to PostgreSQL prior to Redis enqueueing. If database insertion fails, no item is pushed to Redis.
2. **Enqueue Error Isolation**: If PostgreSQL insertion succeeds but Redis enqueueing fails, a structured log containing the `job_id` is recorded, and a clean HTTP error response is returned.
3. **Single Enqueue Guarantee**: A successful `CreateJob` call enqueues the job payload into Redis exactly once.
4. **Workers Excluded**: Note that worker pool consumption (`BRPOP`), execution logic, and status transitions belong to Phase 3.3.
