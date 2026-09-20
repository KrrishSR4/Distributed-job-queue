# Data Flow

The following describes the step-by-step flow of data through the system for a standard immediate job.

## Complete Job Flow

```mermaid
sequenceDiagram
    participant Client as Angular Client
    participant API as Go API
    participant DB as PostgreSQL
    participant Redis as Redis Queue
    participant Worker as Go Worker
    
    Client->>API: POST /api/v1/jobs (Payload, Priority)
    
    Note over API,DB: 1. Persist Authoritative State
    API->>DB: INSERT INTO jobs (status='queued')
    DB-->>API: Return Job ID
    
    Note over API,Redis: 2. Transport Layer
    API->>Redis: LPUSH queue:priority (Job ID)
    API-->>Client: HTTP 201 Created (Job Details)
    
    Note over Redis,Worker: 3. Asynchronous Consumption
    Worker->>Redis: BRPOP queue:critical, queue:high...
    Redis-->>Worker: Return Job ID
    
    Note over Worker,DB: 4. Atomic Lock
    Worker->>DB: UPDATE jobs SET status='processing' WHERE id=X AND status='queued'
    DB-->>Worker: Acknowledge Lock
    
    Note over Worker: 5. Execution
    Worker->>Worker: Execute business logic (DemoProcessor)
    
    Note over Worker,DB: 6. Terminal State
    Worker->>DB: UPDATE jobs SET status='completed' WHERE id=X
    
    Note over DB,API: 7. Real-time Notification
    Worker->>API: Broadcast via WebSocket Hub (or DB triggers)
    API->>Client: WS Message: { status: 'completed' }
```

## Flow Guarantees
- **At-Least-Once Delivery**: Redis `BRPOP` pulls the job ID. If the worker crashes immediately, the job remains in PostgreSQL as `queued`. The Scheduler (recovery mechanism) will eventually detect it and re-enqueue it.
- **Exactly-Once Processing**: Even if Redis delivers the same Job ID to two workers (duplicate delivery), only ONE worker will successfully execute the `UPDATE ... WHERE status='queued'` lock in PostgreSQL. The second worker will receive a 0-rows-affected response and safely abort.
