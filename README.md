# Distributed Job Queue (Monorepo)

A high-performance, resilient, distributed job processing and queue management system with a modern B2B SaaS management dashboard.

## 📁 Repository Structure

```
distributed-job-queue/
│
├── .github/                  # CI/CD Workflows & GitHub Actions
│   └── workflows/
│
├── 1-client/                 # Phase 1: Angular + JavaScript Frontend SaaS Dashboard
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── angular.json
│   └── ...
│
├── 2-server/                 # Phase 2: Go Backend REST API Foundation
│   ├── cmd/
│   │   └── api/
│   │       └── main.go
│   ├── internal/
│   │   ├── api/              # Handlers, Middleware, Routes
│   │   ├── config/           # Environment Configuration
│   │   ├── database/         # PostgreSQL pgx Pool & Health
│   │   ├── jobs/             # Repository & Service Layers
│   │   └── models/           # Job Schema & DTOs
│   ├── pkg/                  # Logger & Response Helpers
│   ├── migrations/           # SQL DDL Scripts
│   ├── .env.example
│   ├── go.mod
│   └── go.sum
│
├── 3-infrastructure/         # Docker, Kubernetes, Terraform & Monitoring configs
│   ├── docker/
│   ├── kubernetes/
│   ├── terraform/
│   └── monitoring/
│
├── 4-docs/                   # Architecture, API & System Design Docs
│   ├── architecture/
│   │   └── backend.md        # Layered architecture & DB schema
│   ├── api/
│   │   └── endpoints.md      # REST API specification & JSON examples
│   └── system-design/
│
├── .gitignore
├── LICENSE                   # MIT License
├── README.md
└── docker-compose.yml
```

---

## 🚀 Quick Start

### 1-client (Frontend Dashboard)

Navigate to the `1-client` directory to run or build the Angular dashboard:

```bash
cd 1-client

# Install dependencies
npm install

# Start development server (http://localhost:4200)
npm start

# Build production bundle
npm run build
```

---

### 2-server (Go Backend API)

Navigate to the `2-server` directory to run unit tests or start the Go REST API server:

```bash
cd 2-server

# Run unit tests
go test -v ./...

# Run static analysis
go vet ./...

# Start Go API server (http://localhost:8080)
go run ./cmd/api
```

---

## 🛠 Tech Stack

- **Frontend (`1-client`)**: Angular (JavaScript), RxJS, Tailwind CSS v4, ECharts
- **Backend (`2-server`)**: Go 1.22+, Chi Router, pgx (PostgreSQL), slog Structured Logging
- **Data Layer**: PostgreSQL 16 (Relational Persistence), Redis 7 (Queue Broker)
- **Infrastructure (`3-infrastructure`)**: Docker, Kubernetes, Prometheus, Grafana

---

## 🏗 System Design

The Distributed Job Queue features a highly decoupled, scalable architecture designed for fault tolerance and high concurrency.

- **Architecture**: A stateless Go API receives jobs and pushes them to Redis. A fleet of independent Go Workers processes the jobs.
- **Source of Truth**: PostgreSQL serves as the persistent, authoritative state store, ensuring no jobs are lost.
- **Idempotency**: Implemented via database unique constraints to protect against duplicate HTTP requests.
- **Fault Tolerance**: Includes automatic stale-job recovery, exponential backoff retries, and a Dead Letter Queue (DLQ).
- **Real-Time UI**: WebSockets stream status updates to the Angular Dashboard without polling.
- **Observability**: Prometheus metrics and Grafana dashboards natively integrated to monitor HTTP traffic, worker performance, and job lifecycles.

For full architectural diagrams, component data flows, and performance benchmarks, see the **[System Design Documentation](4-docs/system-design/overview.md)**.

---

## 🐳 Dockerization (Phase 6.1 & 6.2)

The application components are fully containerized using multi-stage Docker builds.

Available images:
- **Go Backend (`2-server/Dockerfile`)**: Unified image capable of running as the REST API or the Background Worker (controlled via `APP_MODE` env var).
- **Angular Frontend (`1-client/Dockerfile`)**: Minimal Nginx runtime serving the static UI build.

The application has been fully containerized and orchestrated with Docker Compose.

**Run the Full Stack (Frontend, API, Workers, Redis, Postgres):**
```bash
docker compose up -d --build
```
*Access the dashboard at [http://localhost:4200](http://localhost:4200).*

**Scale Workers:**
```bash
docker compose up -d --scale worker=3
```

For detailed architecture and internal container commands, see [Dockerization Docs](4-docs/docker/dockerization.md) and [Docker Compose Docs](4-docs/docker/docker-compose.md).

---

## ☸️ Kubernetes Orchestration (Phase 6.3 - 6.6)

The application includes production-ready Kubernetes manifests featuring proper networking, internal DNS routing, graceful graceful shutdowns, and horizontal scaling.

**Deploy the Complete Stack:**
```bash
# Apply all manifests using Kustomize
kubectl apply -k 3-infrastructure/kubernetes/
```

**Access the Application:**
The Frontend is exposed via a NodePort on port `30000`. Navigate to:
[http://localhost:30000](http://localhost:30000)

**Monitor Pods & Services:**
```bash
kubectl get pods -n distributed-job-queue
kubectl get svc -n distributed-job-queue
```

**Manual Horizontal Scaling:**
```bash
kubectl scale deployment api --replicas=3 -n distributed-job-queue
kubectl scale deployment worker --replicas=5 -n distributed-job-queue
```

For a deep dive into the Kubernetes topology and scaling mechanics, see the [Kubernetes Validation Docs](4-docs/kubernetes/validation.md).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
