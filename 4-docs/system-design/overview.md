# System Design Overview

## 1. Project Overview
The **Distributed Job Queue** is a scalable, fault-tolerant background job processing system. It enables client applications to enqueue jobs asynchronously, process them reliably through a distributed worker pool, and receive real-time status updates.

## 2. Core Requirements Supported
- **Asynchronous Processing**: Clients enqueue jobs without waiting for execution.
- **Reliable State Management**: Jobs must not be lost if a component crashes.
- **Fault Tolerance**: Retries for transient failures, Dead Letter Queue (DLQ) for terminal failures, and recovery mechanisms for stalled workers.
- **Scheduling**: Support for delayed job execution.
- **Prioritization**: Support for Critical, High, Medium, and Low priorities.
- **Concurrency Control**: Bounded worker pools and backpressure handling.
- **Idempotency**: Prevent duplicate job creation from duplicate client requests.
- **Real-time Notifications**: WebSockets push status updates to connected clients.

## 3. High-Level Architecture
The system consists of the following tiers:
1. **Frontend (Angular)**: A dashboard to visualize queue state and metrics.
2. **REST API (Go)**: Receives job submissions and serves queue data.
3. **Database (PostgreSQL)**: The durable, persistent source of truth for all job states.
4. **Message Broker (Redis)**: The fast transport layer for distributing work to workers.
5. **Worker Pool (Go)**: A fleet of stateless worker routines that consume from Redis and execute business logic.
6. **Real-time Gateway (WebSocket)**: Broadcasts state changes to clients without polling.

*(For detailed architectural diagrams, see [architecture.md](architecture.md))*

## 4. Components Summary
| Component | Responsibility |
|-----------|----------------|
| Angular Client | Dashboard UI, queue monitoring, and job submission |
| Go API | REST endpoints, WebSocket connections, Idempotency checks |
| PostgreSQL | Persistent source of truth, unique constraints, transactional state |
| Redis | Queue transport, pub/sub, decoupled producer/consumer flow |
| Workers | Job execution, bounded concurrency |
| Scheduler | Polling database for delayed jobs and stale/timeout recoveries |
| Retry System | Exponential backoff for transient failures |
| DLQ | Storing permanently failed jobs after maximum attempts |

## 5. Detailed Documentation Index
- [Architecture & Components](architecture.md)
- [Data Flow](data-flow.md)
- [Job Lifecycle](job-lifecycle.md)
- [Horizontal Scaling](scaling.md)
- [Fault Tolerance](fault-tolerance.md)
- [Idempotency](idempotency.md)
- [Performance & Benchmarks](performance.md)
- [Trade-offs & Limitations](trade-offs.md)
