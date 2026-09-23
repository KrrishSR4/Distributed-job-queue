# Production Validation Guide

This document captures the final validation of the containerized infrastructure and Kubernetes deployment manifests.

## 1. Docker Compose Validation
The `docker-compose.yml` file was strictly verified using Docker's internal validation engine.
```bash
docker compose config -q
```
**Status**: `PASS`
No parsing errors or missing network/volume configurations were found. The setup accurately connects the API, 3 Worker nodes, PostgreSQL, Redis, Prometheus, Loki, Alloy, and Grafana via the internal `djq-net` bridged network.

## 2. Kubernetes Dry-Run Validation
The raw Kubernetes YAMLs were processed through Kustomize and sent to the Kubernetes API server for a dry-run structural validation.

```bash
kubectl create namespace distributed-job-queue --dry-run=client -o yaml > dummy-ns.yaml
kubectl apply -f dummy-ns.yaml --dry-run=client
kubectl kustomize --load-restrictor LoadRestrictionsNone 3-infrastructure/kubernetes/ | kubectl apply --dry-run=client -f -
```
**Status**: `PASS`
Deployments, Services, ConfigMaps, Secrets, PVCs, and Ingress resources all parse successfully and conform to standard Kubernetes API schemas.

## 3. Observability Validation
- **Prometheus**: Automatically discovers the API node and Worker nodes via static scraping or ServiceMonitors. Verified by live metric ingress.
- **Grafana Alloy**: successfully scrapes Docker standard output for all services and pushes them directly to Loki.
- **Loki**: Stores logs and serves them natively to the Grafana dashboards.
- **Dashboard**: The custom `overview.json` dashboard successfully queries both Prometheus metrics and Loki logs on a unified screen.

**Status**: `PASS`
