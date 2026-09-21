# Phase 6.2: Docker Compose Orchestration

This document outlines the full Docker Compose setup for the Distributed Job Queue project. Using Docker Compose, we can bring up the entire architecture—Frontend, Go API, Go Workers, PostgreSQL, and Redis—with a single command.

## Architecture & Networking Diagram

```mermaid
graph TD
    Browser[User Browser]
    
    subgraph "Docker Compose Network"
        UI[frontend (Nginx)]
        API[api (Go)]
        W[worker (Go)]
        DB[(postgres)]
        Cache[(redis)]
        
        UI -- "/api/* & /ws" --> API
        API -- "Read/Write State" --> DB
        API -- "Enqueue Jobs" --> Cache
        Cache -- "Dequeue Jobs" --> W
        W -- "Update Status" --> DB
    end

    Browser -- "http://localhost:4200" --> UI
    Browser -. "http://localhost:8080\n(Direct API Access)" .-> API
```

## Services Defined

- **`postgres`**: Runs PostgreSQL 16. Uses a named volume (`postgres_data`) to persist job state across container restarts. Includes a `pg_isready` healthcheck.
- **`redis`**: Runs Redis 7. Acts as our fast, in-memory job queue broker. Includes a `redis-cli ping` healthcheck.
- **`api`**: The Go REST API. Depends on `postgres` and `redis` being healthy before starting. Exposes port `8080`.
- **`worker`**: The Go background worker pool. Uses the exact same image as the API but runs in worker-only mode (`APP_MODE=worker`). Depends on `postgres` and `redis`. Does not expose any ports.
- **`frontend`**: The Angular UI served via Nginx. Exposes port `4200`. Nginx acts as a reverse proxy, forwarding `/api/` and `/ws` requests internally to the `api:8080` container.

## Important Configurations

### Volumes & Persistence
We use a named volume for the database to ensure jobs aren't lost when containers stop:
```yaml
volumes:
  postgres_data:
```
*Note: Redis is configured as an ephemeral queue. Only the database state is persisted.*

### Migrations
The Go application includes an automatic migration system (`AutoMigrate(ctx)`). When the `api` or `worker` container connects to the fresh PostgreSQL instance for the first time, it automatically executes the required DDL SQL scripts to create the `jobs` table and necessary indexes.

## Common Developer Commands

### Start the Stack
Start everything in the background and build images if necessary:
```bash
docker compose up -d --build
```
*The dashboard will be available at [http://localhost:4200](http://localhost:4200).*

### Worker Scaling
Simulate a high-throughput environment by horizontally scaling the worker instances. Docker Compose will automatically spin up multiple containers that all connect to the shared Redis queue:
```bash
docker compose up -d --scale worker=3
```

### Checking Status & Logs
```bash
# Check container status
docker compose ps

# Follow logs for all services
docker compose logs -f

# Follow logs for a specific service (e.g. workers)
docker compose logs -f worker
```

### Shutting Down
Stop and remove containers (data in volumes remains intact):
```bash
docker compose down
```

### Full Factory Reset (Wipe Data)
Stop containers **and** delete the named volumes, destroying all database data:
```bash
docker compose down -v
```

## Troubleshooting
- **Frontend can't reach API**: Ensure you are accessing the dashboard via `localhost:4200`. The Nginx configuration intercepts `/api/` calls and proxies them to the internal Docker DNS name `api:8080`. If you access the raw API directly, use `localhost:8080`.
- **Containers crash on startup**: This usually happens if PostgreSQL or Redis take too long to start. The `depends_on: condition: service_healthy` rules in the `docker-compose.yml` prevent this race condition.
