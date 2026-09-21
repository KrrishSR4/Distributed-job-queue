# Prometheus Metrics (Phase 7.1)

This document describes the observability metrics integrated into the Distributed Job Queue during Phase 7.1 using the official Prometheus Go SDK (`client_golang`).

## Overview

We have exposed a standard `/metrics` HTTP endpoint in the Go Backend (port `8080`). It provides low-cardinality metrics covering both system/HTTP behavior and domain-specific Job lifecycle states.

## Available Metrics

### HTTP API Metrics
- **`djq_http_requests_total` (Counter)**
  - Labels: `method`, `route`, `status`
  - Records the total number of HTTP requests processed by the server. Note that `route` captures the normalized path (e.g., `/api/v1/jobs/{id}`) instead of raw URLs to prevent high cardinality.
- **`djq_http_request_duration_seconds` (Histogram)**
  - Labels: `method`, `route`
  - Latency of HTTP API requests.
- **`djq_http_requests_in_flight` (Gauge)**
  - Tracks the exact number of HTTP requests currently being served.

### Job Lifecycle Metrics
- **`djq_jobs_created_total` (Counter)**: Increments when a job is inserted into the database. Labels: `job_type`, `priority`.
- **`djq_jobs_completed_total` (Counter)**: Increments when a worker successfully completes a job. Labels: `job_type`.
- **`djq_jobs_failed_total` (Counter)**: Increments when a worker fails a job (but might retry). Labels: `job_type`.
- **`djq_jobs_cancelled_total` (Counter)**: Increments when a user intentionally cancels a job via the API. Labels: `job_type`.
- **`djq_jobs_retried_total` (Counter)**: Increments when a job is scheduled for a retry via the Exponential Backoff manager. Labels: `job_type`.
- **`djq_jobs_dlq_total` (Counter)**: Increments when a job reaches its max attempts and is sent to the Dead Letter Queue. Labels: `job_type`.

### Job Processing & Worker Metrics
- **`djq_job_processing_duration_seconds` (Histogram)**
  - Labels: `job_type`, `status` (success, error)
  - Captures how long a worker spends executing the actual job payload.
- **`djq_workers_active` (Gauge)**
  - Tracks the number of worker goroutines alive and polling.
- **`djq_jobs_processing` (Gauge)**
  - Tracks how many jobs are currently actively running inside the processor.
- **`djq_worker_errors_total` (Counter)**
  - Tracks internal system errors (e.g., failed to connect to Redis, database timeout). This does *not* track job logic failures.

## Cardinality Rules

To ensure Prometheus remains stable and fast:
1. **Never use Job IDs as labels.** Job IDs are UUIDs (infinite cardinality) and will blow up the memory footprint of Prometheus.
2. Route parameters are masked. A request to `/api/v1/jobs/123-abc` is recorded under the label `route="/api/v1/jobs/{id}"`.

## Accessing Metrics

### Local Development (Docker Compose)
A Prometheus instance runs automatically when you use `docker compose up -d`.
1. **Metrics Data**: The raw text output is available at `http://localhost:8080/metrics`.
2. **Prometheus UI**: Open [http://localhost:9090](http://localhost:9090). You can search for `djq_jobs_completed_total` in the expression browser.

### Kubernetes Integration
The `api` deployment in Kubernetes has standard scrape annotations:
```yaml
annotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "8080"
  prometheus.io/path: "/metrics"
```
If your cluster has a Prometheus scraper installed (or you use an external scraper), it will automatically discover and scrape the API pods without requiring a complex `ServiceMonitor` or Prometheus Operator installation.
