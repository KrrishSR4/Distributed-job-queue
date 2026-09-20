# System Architecture

The Distributed Job Queue leverages a decoupled architecture where the API handles client ingestion while background workers process tasks asynchronously. 

## High-Level Architecture Diagram

```mermaid
graph TD
    Client[Angular Client]
    
    subgraph Load Balancer / API Layer
        API1[Go API Instance #1]
        API2[Go API Instance #2]
    end
    
    subgraph Data Layer
        DB[(PostgreSQL)]
        Cache[(Redis)]
    end
    
    subgraph Worker Tier
        W1[Go Worker #1]
        W2[Go Worker #2]
        W3[Go Worker #3]
    end
    
    %% Connections
    Client -- "REST (POST /jobs)" --> API1
    Client -- "WebSocket (Status Updates)" --> API1
    
    API1 -- "1. Persist Job State" --> DB
    API1 -- "2. Enqueue Job ID" --> Cache
    
    Cache -- "3. Pop Job ID" --> W1
    Cache -- "3. Pop Job ID" --> W2
    Cache -- "3. Pop Job ID" --> W3
    
    W1 -- "4. Fetch & Lock Job" --> DB
    W1 -- "5. Update Status (Completed)" --> DB
    
    API1 -. "Listen for DB changes/Events" .-> DB
    API1 -. "Push Events" .-> Client
```

## Core Design Principles

1. **Database as the Source of Truth**: Redis is strictly used as an ephemeral transport mechanism (the queue). If Redis crashes, jobs are not lost because PostgreSQL holds the definitive state of every job. 
2. **Stateless API**: The Go API instances do not hold job state in memory. They can be scaled horizontally without session stickiness.
3. **Decoupled Workers**: Workers connect directly to Redis and PostgreSQL. They are completely unaware of the HTTP API, allowing them to scale independently based on processing load.
4. **Event-Driven UI**: The Angular client relies on WebSockets for UI reactivity, eliminating expensive long-polling against the database.
