# Phase 6.1: Dockerization

This document outlines the containerization strategy for the Distributed Job Queue project. Containerizing the application allows us to run isolated, predictable, and scalable instances of the Go backend and Angular frontend.

## Why Docker?
Docker encapsulates our applications and all their dependencies into standardized units (containers) for software development. This ensures consistency across local development, staging, and production environments, and paves the way for container orchestration via Kubernetes (planned for future phases).

## Architecture Diagram

```mermaid
graph TD
    UI[Angular Container (Nginx)]
    API[Go API Container]
    W[Go Worker Container]
    DB[(PostgreSQL)]
    Cache[(Redis)]

    UI -- "HTTP / WS (localhost:8080)" --> API
    API -- "State" --> DB
    API -- "Enqueue" --> Cache
    Cache -- "Dequeue" --> W
    W -- "Update State" --> DB

    classDef container fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef infra fill:#f3e5f5,stroke:#4a148c,stroke-width:2px,stroke-dasharray: 5 5;
    
    class UI,API,W container;
    class DB,Cache infra;
```
*(Note: PostgreSQL and Redis container orchestration via Docker Compose will be fully implemented in Phase 6.2)*

## Multi-Stage Builds
Both the Backend and Frontend utilize **multi-stage Docker builds** to ensure production images are as small and secure as possible.
1. **Builder Stage**: Contains compilers (Go) and Node.js toolchains to fetch dependencies and compile the code.
2. **Runtime Stage**: Contains only a minimal OS (`alpine`), the compiled binary or static files, and the runner (Nginx for frontend, none for backend).

## Backend Container (API & Worker)
The backend uses a single unified binary (`cmd/api/main.go`). It acts as either the REST API, the Background Worker, or both, depending on the `APP_MODE` environment variable.

### Environment Configuration
The backend container is driven entirely by environment variables. No secrets or configurations are baked into the image.
- `APP_MODE`: `api`, `worker`, or `all`
- `DATABASE_URL`: Connection string to PostgreSQL
- `REDIS_URL`: Connection string to Redis
- `PORT`: Port the API listens on
- `WORKER_COUNT` / `WORKER_ID`: Controls concurrency and identification for worker modes.

### Health Check Compatibility
The Go API container natively supports health checking via the `GET /health` endpoint, checking database and Redis connectivity.

## Frontend Container (Angular)
The Angular application is built into static HTML/JS/CSS and served using an Nginx web server inside an `alpine` image.
- A custom `nginx.conf` ensures Angular's SPA (Single Page Application) routes fallback to `index.html`.
- **API Configuration**: The Angular client connects to `http://localhost:8080`. When running via Docker Compose (Phase 6.2), the API container port will be mapped to the host's port 8080, allowing seamless communication from the user's browser.

## Security Basics Implemented
- **No Secrets in Images**: `.dockerignore` prevents `.env` and local configs from being copied.
- **Minimal Runtimes**: Compiled binaries and static assets are placed in lightweight `alpine` images, reducing the attack surface.
- **Non-Root User**: The Go runtime image executes the binary as a restricted `appuser`.

## Building the Images Individually

### 1. Build Go Backend Image
```bash
cd 2-server
docker build -t distributed-job-queue-backend:latest .
```

### 2. Build Angular Frontend Image
```bash
cd 1-client
docker build -t distributed-job-queue-client:latest .
```

*(These steps validate the build process. Phase 6.2 will automate orchestration via `docker-compose.yml`.)*
