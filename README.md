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
- **Data Layer**: PostgreSQL 16 (Relational Persistence), Redis 7 (Phase 3 Queue Broker)
- **Infrastructure (`3-infrastructure`)**: Docker, Kubernetes, Prometheus, Grafana

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
