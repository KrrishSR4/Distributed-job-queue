# Testing Guide

This guide details how to run the automated integration tests for the Distributed Job Queue.

## Integration & Chaos Testing

The integration test suite validates the core mechanics of the job processing engine, including basic lifecycles, retries, Dead Letter Queue (DLQ) routing, priorities, scheduling, and cancellations.

### Prerequisites
Ensure the full stack is running locally:
```bash
docker compose up -d
```

### Running the Tests
We have created a dedicated integration runner script in Go that exercises the API. Run it from the root of the project:

```bash
go run scripts/integration/main.go
```

### What it Tests
1. **Basic Lifecycle**: Creates a medium priority job and waits for it to complete.
2. **Retry & DLQ**: Creates a job designed to fail (`type: test_fail`). It verifies that the worker retries the job up to `max_attempts` (2) and eventually routes it to the `failed` state (which simulates the DLQ).
3. **Priority**: Submits `low` and `critical` priority jobs to ensure the Redis Priority Queue pushes the critical job to the top.
4. **Scheduler**: Submits a job scheduled 5 seconds in the future. The script waits to ensure it remains `scheduled` and is later picked up and `completed`.
5. **Cancellation**: Submits a scheduled job and immediately issues a cancel request. It verifies the job enters the `cancelled` state.
6. **Timeout & Recovery**: Relies on the internal scheduler's stale-job recovery mechanism to rescue jobs that crash mid-processing.

### Output Example
```text
Starting Integration Tests...

--- Testing Basic Job Lifecycle ---
Created job a1181c05-d60d-4243-b6e2-298cffc6e309 (Priority: medium)
Job a1181c05-d60d-4243-b6e2-298cffc6e309 reached status completed
Basic Lifecycle Test Passed!

--- Testing Retry & DLQ ---
Created job 1065915a-f89a-4be9-9ced-c9e7dd89bef2 (Priority: medium)
Job 1065915a-f89a-4be9-9ced-c9e7dd89bef2 reached status failed
Retry & DLQ Test Passed!
...
All Integration Tests Completed Successfully.
```
