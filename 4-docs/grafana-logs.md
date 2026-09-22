# Grafana Log Exploration & Correlation

This document serves as a guide for operators to troubleshoot and investigate the Distributed Job Queue using Grafana Loki.

## Dashboards & Correlations
In Phase 7.4, we enhanced the Grafana dashboards to create a seamless operational workflow from Metrics directly to Logs.
1. **API Dashboard**: The global 4xx and 5xx panels now contain "Data Links". Clicking these links will immediately take you to Loki's Explore panel, filtered specifically for API warnings and errors within the same time window.
2. **Jobs & Workers Dashboard**: The Worker Errors and Job Outcomes panels contain data links to jump directly to Worker error logs, or logs relating to failed/retried/DLQ jobs.
3. **Logs Dashboard**: A brand new dedicated dashboard (`Distributed Job Queue - Logs`) was created to provide a high-level overview of recent API and Worker logs, with specific panels highlighting errors and failures. It also provides a `$job_id` search filter at the top.

## Investigating a Job Lifecycle
To trace what happened to a specific job, you do not need to read raw container logs manually.

**Workflow:**
1. Identify the `job_id` (e.g. `job_12345`).
2. Open the **Distributed Job Queue - Logs** dashboard.
3. Enter `job_12345` into the **Search by Job ID** variable field.
4. The panels will automatically filter all API and Worker logs to show only entries containing that `job_id`.
5. You can trace its lifecycle:
   - *API Logs*: "job created"
   - *Worker Logs*: "job processing", "job completed" (or "job failed", "job retrying", etc.)

## LogQL Quick Reference
You can use the **Explore** tab in Grafana to write custom queries using LogQL.

### Cardinality Safety
**Important:** Do not use high-cardinality fields like `job_id`, `request_id`, or `timestamps` as Loki labels. Doing so creates too many index streams and crashes Loki. These values are stored inside the JSON log content and are queried using LogQL pipe filters.

### Useful Queries
**All API Logs:**
```logql
{service="api"} | json
```

**All Worker Logs:**
```logql
{service="worker"} | json
```

**Search for a Specific Job ID:**
```logql
{service="worker"} | json |~ "job_12345"
```

**Find API Errors & Warnings:**
```logql
{service="api"} | json | level=~"(?i)ERROR|WARN"
```

**Find Failed or DLQ Jobs:**
```logql
{service="worker"} | json | status=~"(?i)failed|dlq"
```

**Find Specific Job Type:**
```logql
{service="worker"} | json | job_type="image_processing"
```
