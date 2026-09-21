# Grafana Dashboards (Phase 7.2)

This document explains the Grafana dashboards integrated into the Distributed Job Queue during Phase 7.2. Grafana visualizes the low-cardinality Prometheus metrics exposed in Phase 7.1.

## Overview

Grafana is provisioned to start automatically with a `Prometheus` datasource and three pre-configured JSON dashboards. It provides immediate operational visibility out-of-the-box without requiring manual GUI configuration.

## Available Dashboards

1. **Distributed Job Queue - Overview**
   - High-level production view.
   - Monitors active workers, jobs processing, in-flight HTTP requests, and the total queue depth.
   - Shows time-series trends for HTTP request rates (by status), job completion rates, and P95 HTTP latency.

2. **API Dashboard**
   - Dedicated dashboard for HTTP API traffic.
   - Visualizes request rates by route, response status distributions, global 4xx/5xx rates, and P50/P95 latency by route.

3. **Jobs and Workers**
   - Dedicated dashboard for background job processing.
   - Tracks jobs created, completed, failed, retried, and DLQ outcomes over time.
   - Highlights queue backlog trends, worker errors, and P95 job processing durations.
   - Supports filtering via `job_type` and `priority` variables.

## Accessing Grafana

### Local Development (Docker Compose)
Grafana is included in the root `docker-compose.yml`.
1. Start the stack: `docker compose up -d`
2. Open Grafana: [http://localhost:3000](http://localhost:3000)
3. Navigate to **Dashboards** > **DJQ Dashboards**.

### Kubernetes Integration
Grafana is defined in `3-infrastructure/kubernetes/grafana.yaml` and is exposed via a NodePort Service.
1. Apply the manifests:
   ```bash
   kubectl kustomize --load-restrictor LoadRestrictionsNone 3-infrastructure/kubernetes/ | kubectl apply -f -
   ```
2. Access Grafana via the NodePort `30002`:
   - [http://localhost:30002](http://localhost:30002) (or the corresponding minikube/kind node IP).

## Provisioning Architecture

The provisioning configuration is stored entirely in source control under `3-infrastructure/grafana/`:
- `provisioning/datasources/prometheus.yml`: Configures the Prometheus connection (`http://prometheus:9090`).
- `provisioning/dashboards/dashboards.yml`: Configures the file-based dashboard provider.
- `dashboards/*.json`: The source-of-truth Grafana dashboard definitions.

*Note: Changes to the dashboards in the Grafana UI will NOT persist automatically. You must export the updated JSON and overwrite the files in `3-infrastructure/grafana/dashboards/` to make changes permanent.*
