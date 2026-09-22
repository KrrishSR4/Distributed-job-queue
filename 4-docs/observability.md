# Observability Integration Architecture

This document describes the comprehensive, unified observability stack implemented in the Distributed Job Queue. 

Our architecture follows a distinct separation of concerns:
- **Metrics**: `Prometheus` → `Grafana`
- **Logs**: `Alloy` → `Loki` → `Grafana`

Grafana is the single unified operational interface for both.

## 1. Unified Operational Workflow
We have established a clear troubleshooting flow to answer two fundamental operational questions:

### "What is wrong?" (Metrics)
Operators use **Metrics** to identify anomalies or breaches in service level objectives (e.g., latency spikes, high error rates, queue backlogs).

- **API Request Rate / 5xx Rate**: Tracks HTTP health.
- **Queue Depth / Active Workers**: Tracks background processing health.
- **Job Outcomes (Failed/Retried/DLQ)**: Tracks data health.

### "Why is it wrong?" (Logs)
Once an anomaly is identified, operators use **Logs** to find the root cause. 
- Using Grafana Data Links built into our Dashboards, an operator can click a spike on the `5xx Rate` metric and instantly be taken to the exact `Loki` query showing the corresponding API `ERROR` logs.
- By finding a `job_id` in an error log, they can search that `job_id` across the entire system to trace the job's lifecycle from API submission to Worker failure.

## 2. Dashboards Structure
We have logically organized our Grafana dashboards to support this workflow:
1. **Distributed Job Queue - Observability Overview (`overview.json`)**: The master dashboard showing System Health (HTTP traffic, Active Workers), Job Health (Failed vs Completed), and Log Health (Recent Errors).
2. **API Dashboard (`api.json`)**: Deep dive into route-specific HTTP traffic and latencies.
3. **Jobs & Workers Dashboard (`jobs-workers.json`)**: Deep dive into queue depths, DLQ metrics, and worker concurrency.
4. **Logs Dashboard (`logs.json`)**: A dedicated interface to perform correlated, full-text LogQL searches across both `api` and `worker` services simultaneously.

## 3. Cardinality Safety & Best Practices
To ensure observability infrastructure remains fast and resilient:
- **No High-Cardinality Labels**: Values like `job_id`, `request_id`, dynamic URLs, or error payloads are strictly prohibited from being used as Prometheus labels or Loki index labels.
- **Structured JSON Logging**: We output `log/slog` logs in JSON format. Grafana Loki uses the `| json` parser to extract fields like `job_id` at query time, keeping index streams (e.g., `{service="api"}`) low-cardinality.

## 4. Performance & Reliability Isolation
- Observability is non-blocking. If Loki, Alloy, Prometheus, or Grafana crashes, the API and Workers will continue processing jobs without interruption.
- Logging is handled via standard container `stdout`, meaning no network blocking occurs within the Go application.

## 5. Known Limitations
- **No Distributed Tracing**: OpenTelemetry, Tempo, and Jaeger are not currently implemented. End-to-end tracing is achieved by correlating `job_id` across logs.
- **No Alerting**: Automated notifications (Slack/Email/PagerDuty) based on PromQL rules are not yet configured.
- **Local Storage**: Currently, Prometheus and Loki rely on local persistent volumes (Docker volumes / K8s PVCs). Cloud storage blocks (e.g., S3 / GCS) are not configured.
