# Trade-Offs & Limitations

Every system design requires making trade-offs between consistency, availability, performance, and complexity. The following outlines the deliberate design decisions made in this project.

## 1. Architectural Trade-offs

### PostgreSQL as the Source of Truth
- **Pro**: Strongly consistent, durable state. Job updates can leverage ACID transactions. It's easy to query jobs via SQL for the frontend dashboard.
- **Con**: RDBMS can become a scaling bottleneck under extreme high throughput compared to a NoSQL or pure-memory queue.
- **Why**: Background job systems usually prioritize strict guarantees (no lost jobs) over raw throughput. The database load is mitigated by using Redis as a transport buffer.

### Redis as Queue Transport
- **Pro**: Exceptionally fast `LPUSH`/`BRPOP` operations. Decouples the API from the Worker Pool, allowing them to scale independently.
- **Con**: An additional infrastructure component to manage. If Redis crashes before a worker locks a job in PostgreSQL, the job must wait for the Scheduler recovery loop.
- **Why**: Polling PostgreSQL continuously for queued jobs using `SELECT ... FOR UPDATE` is expensive. Redis provides real-time, low-overhead push semantics.

### WebSockets for Notifications
- **Pro**: Real-time push updates to the Angular dashboard (no polling overhead).
- **Con**: WebSockets require persistent connections, leading to higher memory consumption on API instances. Requires complex sticky sessions or pub/sub backplanes when scaling API instances.
- **Why**: Essential for a modern, reactive user experience.

### Idempotency via Database UNIQUE Constraint
- **Pro**: Completely eliminates race conditions without needing distributed locks like Redlock. It is simple and robust.
- **Con**: Relies on database indexes, adding slight overhead to `INSERT` operations.
- **Why**: Safe, built-in mechanism that avoids third-party locking libraries.

## 2. Explicit Limitations (Out of Scope)

Because this is a portfolio project focused on core distributed systems principles, the following enterprise features are intentionally **omitted**:

- **Multi-Region Deployment**: The system assumes a single data center/region.
- **PostgreSQL Replication & Sharding**: The database runs as a single primary node.
- **Redis Cluster**: Operates on a single Redis instance; high-availability Redis (Sentinel/Cluster) is not configured.
- **Service Mesh / Kubernetes**: Deployment is orchestrated simply via Docker Compose rather than complex K8s manifests.
- **Distributed Tracing**: Advanced tracing (e.g., OpenTelemetry, Jaeger) is not included.
- **Kafka / Event Sourcing**: We use a simple message broker (Redis) rather than an append-only event log (Kafka).
