# Kubernetes Services & Networking

This document outlines the network topology of the Distributed Job Queue inside Kubernetes, completed in **Phase 6.4**. 

## Networking Diagram

```mermaid
graph TD
    Browser[Developer's Browser\nhttp://localhost:30000]
    
    subgraph Kubernetes Cluster
        FrontendNodePort[Frontend NodePort\nService: frontend\nNodePort: 30000]
        FrontendPod[Frontend Pod\nAngular + Nginx\nPort: 80]
        
        APIService[API Service\nService: api\nClusterIP: 8080]
        APIPod[API Pods\nGo REST/WS\nPort: 8080]
        
        PostgresService[Postgres Service\nService: postgres\nClusterIP: 5432]
        PostgresPod[Postgres Pod\nPort: 5432]
        
        RedisService[Redis Service\nService: redis\nClusterIP: 6379]
        RedisPod[Redis Pod\nPort: 6379]
        
        WorkerPods[Worker Pods\nx3 Replicas]
    end

    %% External Traffic
    Browser -->|HTTP / WS| FrontendNodePort
    FrontendNodePort -->|Port 80| FrontendPod
    
    %% Nginx Proxy Routing
    FrontendPod -->|/api/* and /ws proxy_pass| APIService
    
    %% API Internal Traffic
    APIService --> APIPod
    APIPod -->|Postgres Query| PostgresService
    APIPod -->|Redis Enqueue| RedisService
    
    %% Worker Internal Traffic
    WorkerPods -->|Postgres Query| PostgresService
    WorkerPods -->|Redis Dequeue| RedisService
    
    %% Database routing
    PostgresService --> PostgresPod
    RedisService --> RedisPod
```

## 1. Internal vs External Boundaries

### External (User-Facing)
The **only** component exposed outside the Kubernetes cluster is the **Frontend**.
- **Type**: `NodePort`
- **Port**: `30000`
- **Access**: You can access the UI via your browser at `http://localhost:30000`.

### Internal (Cluster Only)
The rest of the backend infrastructure is entirely hidden behind internal Kubernetes DNS. They use `ClusterIP` services:
- **API**: `api:8080`
- **PostgreSQL**: `postgres:5432`
- **Redis**: `redis:6379`

## 2. DNS and Service Discovery

Kubernetes automatically provides a DNS record for every Service created within a namespace. Since all our components live in the `distributed-job-queue` namespace, they can communicate using simple, short DNS names.

For example, the API connects to PostgreSQL using the environment variable:
`DATABASE_URL=postgres://djq:djqpassword@postgres:5432/djq_db`
Notice the host is just `postgres`. Kubernetes transparently resolves this to the Postgres Pod IP.

## 3. Frontend & API Communication

**Important Rule:** Docker/Kubernetes internal hostnames are NOT browser-resolvable.

If the Angular frontend directly tried to fetch `http://api:8080/api/v1/jobs` from your browser, it would fail because your laptop's browser does not know what `api` means in Kubernetes DNS context.

**Solution:**
We use the Nginx reverse proxy hosted inside the Frontend container. 
The browser simply sends a request to its own origin `http://localhost:30000/api/v1/jobs`. 
Nginx intercepts any traffic on `/api/` and proxies it *internally* to `http://api:8080/api/`. 

## 4. WebSocket Routing

Real-time features operate over the exact same proxy flow:
1. Browser opens WebSocket connection to `ws://localhost:30000/ws`.
2. Nginx intercepts `/ws`.
3. Nginx sees the `Upgrade` and `Connection` headers configured in its block, and correctly establishes a long-lived WebSocket tunnel to the internal API Pod at `ws://api:8080/ws`.
4. Job progress updates flow back securely without the API ever needing direct public internet exposure.

## 5. Worker Scaling

Workers (currently 3 replicas) do not require a Kubernetes Service because they do not receive incoming network connections. They only establish outbound connections to the `postgres` and `redis` services to fetch work.
