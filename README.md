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
├── 2-server/                 # Phase 2: Go Backend API & Worker Nodes (Scaffolding)
│   ├── cmd/
│   ├── internal/
│   ├── pkg/
│   ├── migrations/
│   └── go.mod
│
├── 3-infrastructure/         # Docker, Kubernetes, Terraform & Monitoring configs
│   ├── docker/
│   ├── kubernetes/
│   ├── terraform/
│   └── monitoring/
│
├── 4-docs/                   # Architecture, API & System Design Docs
│   ├── architecture/
│   ├── api/
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

## 🛠 Tech Stack

- **Frontend (`1-client`)**: Angular (JavaScript), RxJS, Tailwind CSS v4, ECharts
- **Backend (`2-server`)**: Go (Golang) *(Phase 2)*
- **Broker & Persistence**: Redis, PostgreSQL *(Phase 2)*
- **Infrastructure (`3-infrastructure`)**: Docker, Kubernetes, Prometheus, Grafana *(Phase 2)*

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
