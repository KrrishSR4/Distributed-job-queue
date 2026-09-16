# Redis Infrastructure & Connection Layer (Phase 3.1)

## Overview

Redis 7 has been introduced as the in-memory broker and event stream layer for the Distributed Job Queue architecture. In Phase 3.1, a production-grade connection layer has been established using `github.com/redis/go-redis/v9`.

```
Angular Frontend (http://localhost:4200)
       │
       ▼
Go REST API (http://localhost:8080)
       │
       ├───► PostgreSQL (5432) — Job Metadata & State Persistence
       │
       └───► Redis (6379) — In-Memory Queue & Pub/Sub Broker (Phase 3.1 Connection Layer)
```

---

## Why Redis?

1. **High-Throughput In-Memory Buffering**: Pushing job payloads to Redis atomic list/ZSET buffers allows API handlers to return `202 Accepted` responses in sub-milliseconds.
2. **Atomic Operations**: Redis provides atomic `LPUSH`, `RPUSH`, `BRPOP`, `ZADD`, and `ZPOPMIN` primitives ensuring single-consumer job delivery without concurrency race conditions.
3. **Pub/Sub Real-Time Events**: Redis Pub/Sub channels broadcast live execution events to WebSocket engines and monitoring dashboards.

---

## Configuration

Redis connection parameters are loaded via environment variables using `2-server/internal/config/config.go`:

| Variable | Default Value | Description |
|---|---|---|
| `REDIS_URL` | `redis://localhost:6379` | Connection URI for the Redis broker. |

### Docker Compose Setup

Run local Redis using Docker Compose:

```bash
docker compose up -d redis
```

---

## Resilience & Health Checking

- **Non-blocking Startup**: If Redis is offline or starting up, the Go API server logs a warning and continues running without crashing.
- **Health Check Integration**: `GET /health` tests Redis connection health via `Ping` and reports:
  - `"redis": "connected"` when online.
  - `"redis": "disconnected"` when offline.
- **Graceful Shutdown**: On process termination (`SIGINT`/`SIGTERM`), the Redis client connection pool is cleanly closed.
