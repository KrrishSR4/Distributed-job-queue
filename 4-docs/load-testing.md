# Load Testing Guide

This document records the load testing strategy and results for the Distributed Job Queue. 

## Methodology

We use a custom Go concurrency script (`scripts/load_tester.go`) to simulate a high volume of job creation requests against the REST API. This ensures we test the API's ability to handle concurrent connections, insert jobs into PostgreSQL, and push events to Redis without external tool dependencies.

### Environment setup
- **API Nodes**: 1 containerized instance
- **Worker Nodes**: 3 containerized instances
- **Databases**: Local Dockerized PostgreSQL and Redis
- **Load Script**: 50 concurrent goroutines executing 1000 total job creations.

## Running the Load Test
```bash
go run scripts/load_tester.go
```

## Results (Phase 8 Snapshot)

```text
Starting Load Test: 1000 total requests, 50 concurrent workers

--- Load Test Results ---
Total Time: 1.2229306s
Successful Requests: 1000
Failed Requests: 0
Average Request Latency: 59.714456ms
Requests Per Second: 817.71 req/s
```

### Analysis
- **Throughput**: At ~817 req/sec on a local machine, the system demonstrates excellent ingestion capability. The bottleneck at this scale is primarily local CPU scheduling and network stack overhead.
- **Latency**: 59ms average latency for a transactional endpoint (which performs a Postgres insert and a Redis push) is highly performant.
- **Reliability**: 0 failed requests out of 1000 demonstrates robust connection pooling and resource management in the Go API layer.
