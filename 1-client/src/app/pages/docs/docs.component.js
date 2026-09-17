import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DiagramViewerComponent } from '../../shared/components/diagram-viewer/diagram-viewer.component.js';

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [CommonModule, RouterModule, DiagramViewerComponent],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white pb-24 relative">
      
      <!-- ========================================== -->
      <!-- STICKY HEADER                              -->
      <!-- ========================================== -->
      <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a routerLink="/" class="flex items-center gap-2 group">
            <span class="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">JobQueue <span class="text-slate-400 font-normal">Docs</span></span>
          </a>
          <nav class="flex items-center gap-6 text-sm font-medium">
            <a routerLink="/dashboard" class="text-slate-600 hover:text-blue-600 transition-colors">Dashboard</a>
            <a href="https://github.com/KrrishSR4/Distributed-job-queue" target="_blank" rel="noopener noreferrer" class="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1">
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col md:flex-row gap-8 relative">
        
        <!-- ========================================== -->
        <!-- SIDEBAR NAVIGATION                         -->
        <!-- ========================================== -->
        <aside class="w-full md:w-64 shrink-0 md:sticky md:top-24 h-max max-h-[calc(100vh-8rem)] overflow-y-auto hidden md:block pr-4 docs-sidebar">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contents</div>
          <nav class="flex flex-col gap-1 text-sm font-medium">
            <button *ngFor="let section of sections" 
                    (click)="scrollTo(section.id)"
                    [class]="activeSection === section.id ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
                    class="text-left px-3 py-2 rounded-lg transition-colors duration-200">
              {{ section.title }}
            </button>
          </nav>
        </aside>

        <!-- Mobile Menu Toggle (Visible only on sm) -->
        <div class="md:hidden w-full bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-sm">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Contents</div>
          <select (change)="scrollTo($event.target.value)" class="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
            <option *ngFor="let section of sections" [value]="section.id" [selected]="activeSection === section.id">{{ section.title }}</option>
          </select>
        </div>

        <!-- ========================================== -->
        <!-- MAIN CONTENT AREA                          -->
        <!-- ========================================== -->
        <main class="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-12 min-w-0">
          
          <div class="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-100 prose-h3:text-xl prose-a:text-blue-600 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-slate-900 prose-pre:text-slate-50 prose-pre:rounded-xl">

            <!-- 1. OVERVIEW -->
            <section id="overview" class="scroll-mt-24 mb-16">
              <h1>Distributed Job Queue</h1>
              <p class="lead text-lg text-slate-600">
                A distributed, asynchronous job processing system designed to demonstrate Go backend engineering, Redis-based queue mechanics, PostgreSQL persistence, and robust worker pool architecture.
              </p>
              
              <h3>Current Technology Stack</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose mb-8">
                <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Frontend</div>
                  <div class="font-mono text-sm text-slate-800">Angular + JS + Tailwind</div>
                </div>
                <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Backend</div>
                  <div class="font-mono text-sm text-slate-800">Go 1.22</div>
                </div>
                <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Database & Queue</div>
                  <div class="font-mono text-sm text-slate-800">PostgreSQL 16 & Redis 7</div>
                </div>
                <div class="p-4 rounded-xl bg-blue-50/50 border border-blue-200 border-dashed">
                  <div class="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Infrastructure (Planned)</div>
                  <div class="font-mono text-sm text-slate-800">Docker + K8s + Terraform</div>
                </div>
              </div>
            </section>

            <!-- 2. HIGH-LEVEL ARCHITECTURE -->
            <section id="high-level-architecture" class="scroll-mt-24 mb-16">
              <h2>High-Level Architecture</h2>
              <p>The system separates the synchronous API request lifecycle from the asynchronous background processing layer, connected by a high-throughput Redis buffer.</p>
              <app-diagram-viewer [definition]="diagramHighLevel"></app-diagram-viewer>
            </section>

            <!-- 3. REQUEST / JOB FLOW -->
            <section id="request-job-flow" class="scroll-mt-24 mb-16">
              <h2>Request / Job Flow</h2>
              <p>When a client submits a job, the Go API validates it, stores the initial metadata in PostgreSQL, and pushes the ID to Redis. This returns a fast <code>201 Created</code> response while workers pick up the heavy lifting concurrently.</p>
              <app-diagram-viewer [definition]="diagramFlow"></app-diagram-viewer>
              <ol>
                <li>Client sends <code>POST /api/v1/jobs</code> with payload.</li>
                <li>API Layer validates the request.</li>
                <li>Service Layer creates a job record in PostgreSQL with status <code>queued</code>.</li>
                <li>Job ID is pushed to Redis list via <code>LPUSH</code>.</li>
                <li>Worker receives job via blocking <code>BRPOP</code>.</li>
                <li>Worker updates PostgreSQL status to <code>processing</code> and processes payload.</li>
                <li>Worker updates PostgreSQL status to <code>completed</code> or handles retries.</li>
              </ol>
            </section>

            <!-- 4. BACKEND ARCHITECTURE -->
            <section id="backend-architecture" class="scroll-mt-24 mb-16">
              <h2>Backend Architecture</h2>
              <p>The Go backend follows a strict layered architecture pattern ensuring separation of concerns.</p>
              <app-diagram-viewer [definition]="diagramBackend" [height]="400"></app-diagram-viewer>
              <ul>
                <li><strong>Router (Chi)</strong>: Maps HTTP endpoints to specific handler functions.</li>
                <li><strong>Middleware</strong>: Injects context, logging, and CORS handling.</li>
                <li><strong>Handler</strong>: Parses JSON requests, validates input, and formats HTTP responses.</li>
                <li><strong>Service</strong>: Orchestrates business logic, calling databases and caches.</li>
                <li><strong>Repository</strong>: Abstracts raw SQL queries and Redis commands.</li>
              </ul>
            </section>

            <!-- 5. REDIS JOB QUEUE -->
            <section id="redis-job-queue" class="scroll-mt-24 mb-16">
              <h2>Redis Job Queue</h2>
              <p>Redis acts as a high-speed, volatile message transport mechanism. The <code>jobs:queue</code> is implemented as a Redis List, providing FIFO (First-In-First-Out) queueing.</p>
              <app-diagram-viewer [definition]="diagramRedis" [height]="300"></app-diagram-viewer>
              <p>Workers use the blocking <code>BRPOP</code> command, which waits efficiently for new items without polling, resulting in instant job processing and minimal CPU usage.</p>
            </section>

            <!-- 6. WORKER POOL -->
            <section id="worker-pool" class="scroll-mt-24 mb-16">
              <h2>Worker Pool Architecture</h2>
              <p>The system spins up concurrent Goroutines (workers) during application startup. The number of workers is configurable.</p>
              <app-diagram-viewer [definition]="diagramWorkerPool" [height]="450"></app-diagram-viewer>
              <p>Each worker independently fetches from Redis. A global <code>sync.WaitGroup</code> ensures graceful shutdown, allowing workers to finish their current job before the server exits when a SIGINT/SIGTERM is received.</p>
            </section>

            <!-- 7. JOB LIFECYCLE -->
            <section id="job-lifecycle" class="scroll-mt-24 mb-16">
              <h2>Job Lifecycle</h2>
              <p>A job transitions through distinct states managed by the worker and stored in PostgreSQL.</p>
              <app-diagram-viewer [definition]="diagramLifecycle" [height]="400"></app-diagram-viewer>
            </section>

            <!-- 8. RETRY MECHANISM -->
            <section id="retry-mechanism" class="scroll-mt-24 mb-16">
              <h2>Retry Mechanism & Backoff</h2>
              <p>Jobs that fail due to transient errors (like external API timeouts) are automatically retried using an exponential backoff strategy.</p>
              <app-diagram-viewer [definition]="diagramRetry" [height]="600"></app-diagram-viewer>
              <p>The delay is calculated using: <code>delay = base_delay × 2^(attempt - 1)</code>. This prevents retry storms that could overwhelm recovering downstream services.</p>
            </section>

            <!-- 9. DATABASE DESIGN -->
            <section id="database-design" class="scroll-mt-24 mb-16">
              <h2>Database Design</h2>
              <p>The PostgreSQL schema uses <code>UUID</code> primary keys and stores unstructured data in a <code>JSONB</code> payload column. Indexes optimize common query patterns.</p>
              <app-diagram-viewer [definition]="diagramER" [height]="500"></app-diagram-viewer>
            </section>

            <!-- 10. API DOCUMENTATION -->
            <section id="api-documentation" class="scroll-mt-24 mb-16">
              <h2>API Documentation</h2>
              
              <div class="space-y-6 not-prose">
                <div class="border border-slate-200 rounded-xl overflow-hidden">
                  <div class="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-3">
                    <span class="px-2 py-1 bg-blue-100 text-blue-700 font-bold text-xs rounded">POST</span>
                    <span class="font-mono text-sm font-bold text-slate-800">/api/v1/jobs</span>
                  </div>
                  <div class="p-4 text-sm text-slate-600">
                    <p class="mb-4">Creates a new asynchronous job.</p>
                    <pre class="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto"><code>{
  "type": "email_notification",
  "payload": {
    "user_id": 123,
    "template": "welcome"
  }
}</code></pre>
                  </div>
                </div>

                <div class="border border-slate-200 rounded-xl overflow-hidden">
                  <div class="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-3">
                    <span class="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded">GET</span>
                    <span class="font-mono text-sm font-bold text-slate-800">/api/v1/jobs/:id</span>
                  </div>
                  <div class="p-4 text-sm text-slate-600">
                    <p>Retrieves metadata and current status for a specific job.</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- 11. HEALTH / DEPENDENCIES -->
            <section id="health-dependencies" class="scroll-mt-24 mb-16">
              <h2>Health & Dependencies</h2>
              <p>The <code>/health</code> endpoint validates the state of the API and its connection to critical downstream infrastructure.</p>
              <app-diagram-viewer [definition]="diagramHealth" [height]="250"></app-diagram-viewer>
            </section>

            <!-- 12. DOCKER / LOCAL DEVELOPMENT -->
            <section id="docker-local" class="scroll-mt-24 mb-16">
              <h2>Docker / Local Development</h2>
              <p>Local development runs the Angular frontend via Angular CLI and the Go backend directly on the host, while Redis is orchestrated via <code>docker-compose.yml</code>.</p>
              <pre><code># Start Redis Broker
docker-compose up -d redis

# Start Go API & Workers
cd 2-server && go run ./cmd/api

# Start Angular Frontend
cd 1-client && ng serve</code></pre>
            </section>

            <!-- 13. DEVOPS ARCHITECTURE -->
            <section id="devops-architecture" class="scroll-mt-24 mb-16">
              <h2>DevOps Architecture (Planned)</h2>
              <p>The intended deployment pipeline heavily utilizes CI/CD automation via GitHub Actions to deploy immutable containers.</p>
              <app-diagram-viewer [definition]="diagramDevops" [height]="400"></app-diagram-viewer>
            </section>

            <!-- 14. KUBERNETES ARCHITECTURE -->
            <section id="kubernetes-architecture" class="scroll-mt-24 mb-16">
              <h2>Kubernetes Architecture (Planned)</h2>
              <p>The production deployment will utilize Kubernetes for orchestration, segregating the stateless API and stateful dependencies.</p>
              <app-diagram-viewer [definition]="diagramK8s" [height]="500"></app-diagram-viewer>
            </section>

            <!-- 15. OBSERVABILITY -->
            <section id="observability" class="scroll-mt-24 mb-16">
              <h2>Observability (Planned)</h2>
              <p>A comprehensive observability stack is planned to monitor queue depth, worker throughput, and processing latency using Prometheus and Grafana.</p>
            </section>

            <!-- 16. SYSTEM DESIGN -->
            <section id="system-design" class="scroll-mt-24 mb-16">
              <h2>System Design Concepts</h2>
              
              <h3>Asynchronous Processing</h3>
              <p>By delegating expensive tasks (like email dispatch or file transcoding) to background workers, the primary HTTP request loop remains incredibly fast (sub-10ms), preventing client timeouts.</p>

              <h3>Horizontal Scaling & Worker Pool</h3>
              <p>The worker pool allows the system to easily scale. If queue depth grows rapidly (backpressure), the system can scale horizontally from 1 worker process to N worker processes, dramatically increasing total throughput.</p>

              <h3>Retry Storms & Exponential Backoff</h3>
              <p>When third-party services fail, retrying immediately causes "retry storms" which can DDOS recovering services. Exponential backoff ensures retries happen further and further apart (1s, 2s, 4s...), giving downstream services time to heal.</p>

              <h3>PostgreSQL as Source of Truth</h3>
              <p>While Redis handles volatile queue transport, PostgreSQL ensures durability. If Redis crashes, job execution states are preserved securely in the persistent SQL database.</p>
            </section>

            <!-- 17. FAILURE SCENARIOS -->
            <section id="failure-scenarios" class="scroll-mt-24 mb-16">
              <h2>Failure Scenarios</h2>
              
              <div class="overflow-x-auto not-prose">
                <table class="w-full text-sm text-left text-slate-600 border-collapse">
                  <thead class="text-xs text-slate-700 uppercase bg-slate-50 border-y border-slate-200">
                    <tr>
                      <th class="px-6 py-3">Scenario</th>
                      <th class="px-6 py-3">Current Behavior</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200">
                    <tr class="bg-white">
                      <td class="px-6 py-4 font-bold text-slate-900">Redis Down</td>
                      <td class="px-6 py-4">API returns 500 when attempting to enqueue. Workers block/panic.</td>
                    </tr>
                    <tr class="bg-white">
                      <td class="px-6 py-4 font-bold text-slate-900">PostgreSQL Down</td>
                      <td class="px-6 py-4">API fails to create job metadata. System halts processing.</td>
                    </tr>
                    <tr class="bg-white">
                      <td class="px-6 py-4 font-bold text-slate-900">Worker Crashes (Panic)</td>
                      <td class="px-6 py-4">Panic recovery middleware traps error, marks job as failed, and re-enqueues if attempts allow.</td>
                    </tr>
                    <tr class="bg-white">
                      <td class="px-6 py-4 font-bold text-slate-900">API Gateway Crashes</td>
                      <td class="px-6 py-4">New requests fail, but existing jobs in Redis continue to process normally by running workers.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <!-- 18. SECURITY -->
            <section id="security" class="scroll-mt-24 mb-16">
              <h2>Security (Planned)</h2>
              <ul>
                <li>Input validation & payload sanitization</li>
                <li>Strict rate limiting on job ingestion</li>
                <li>Least-privilege RBAC for Kubernetes service accounts</li>
                <li>TLS termination at ingress</li>
              </ul>
            </section>

            <!-- 19. PROJECT ROADMAP -->
            <section id="project-roadmap" class="scroll-mt-24 mb-16">
              <h2>Project Roadmap</h2>
              <ul class="not-prose space-y-3 font-mono text-sm">
                <li class="flex items-center gap-3"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> <span class="line-through text-slate-400">Phase 1: Frontend Dashboard</span></li>
                <li class="flex items-center gap-3"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> <span class="line-through text-slate-400">Phase 2: Go Backend Foundation</span></li>
                <li class="flex items-center gap-3"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> <span class="line-through text-slate-400">Phase 3.1: Redis Infrastructure</span></li>
                <li class="flex items-center gap-3"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> <span class="line-through text-slate-400">Phase 3.2: Redis Job Queue</span></li>
                <li class="flex items-center gap-3"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> <span class="line-through text-slate-400">Phase 3.3: Go Worker Pool</span></li>
                <li class="flex items-center gap-3"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> <span class="line-through text-slate-400">Phase 3.4: Exponential Backoff</span></li>
                <li class="flex items-center gap-3"><span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> <span class="font-bold text-blue-600">Next: Phase 4 Implementation</span></li>
              </ul>
            </section>

            <!-- 20. COMPLETE SYSTEM DIAGRAM -->
            <section id="complete-system-diagram" class="scroll-mt-24">
              <h2>Complete System Architecture</h2>
              <p>This diagram represents the holistic vision of the distributed system, combining the existing application layer with the planned infrastructure and observability stack.</p>
              <app-diagram-viewer [definition]="diagramComplete" [height]="700"></app-diagram-viewer>
            </section>

          </div>
        </main>
      </div>

    </div>
  `,
  styles: [`
    .docs-sidebar::-webkit-scrollbar { width: 4px; }
    .docs-sidebar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
  `]
})
export class DocsPageComponent {
  
  sections = [
    { id: 'overview', title: '1. Overview' },
    { id: 'high-level-architecture', title: '2. High-Level Architecture' },
    { id: 'request-job-flow', title: '3. Request / Job Flow' },
    { id: 'backend-architecture', title: '4. Backend Architecture' },
    { id: 'redis-job-queue', title: '5. Redis Job Queue' },
    { id: 'worker-pool', title: '6. Worker Pool' },
    { id: 'job-lifecycle', title: '7. Job Lifecycle' },
    { id: 'retry-mechanism', title: '8. Retry Mechanism' },
    { id: 'database-design', title: '9. Database Design' },
    { id: 'api-documentation', title: '10. API Documentation' },
    { id: 'health-dependencies', title: '11. Health / Dependencies' },
    { id: 'docker-local', title: '12. Docker / Local Dev' },
    { id: 'devops-architecture', title: '13. DevOps Architecture' },
    { id: 'kubernetes-architecture', title: '14. K8s Architecture' },
    { id: 'observability', title: '15. Observability' },
    { id: 'system-design', title: '16. System Design' },
    { id: 'failure-scenarios', title: '17. Failure Scenarios' },
    { id: 'security', title: '18. Security' },
    { id: 'project-roadmap', title: '19. Project Roadmap' },
    { id: 'complete-system-diagram', title: '20. Complete Diagram' },
  ];

  activeSection = 'overview';
  
  diagramHighLevel = `
graph TD
    User([User]) -->|HTTP REST| Angular[Angular Dashboard]
    Angular -->|POST /api/v1/jobs| API[Go API Gateway]
    
    subgraph Backend Core
      API -->|SQL Insert| Postgres[(PostgreSQL)]
      API -->|LPUSH| Redis[(Redis Queue)]
    end
    
    subgraph Execution Layer
      Redis -->|BRPOP| WorkerPool[Worker Pool]
      WorkerPool -->|Goroutine| Worker1[Worker 1]
      WorkerPool -->|Goroutine| Worker2[Worker 2]
      WorkerPool -->|Goroutine| Worker3[Worker 3]
      Worker1 -->|Update Status| Postgres
      Worker2 -->|Update Status| Postgres
      Worker3 -->|Update Status| Postgres
    end
    
    classDef curr fill:#e2e8f0,stroke:#64748b,stroke-width:2px;
    classDef planned fill:#fef3c7,stroke:#d97706,stroke-width:2px,stroke-dasharray: 5 5;
    class User,Angular,API,Postgres,Redis,WorkerPool,Worker1,Worker2,Worker3 curr;
  `;

  diagramFlow = `
sequenceDiagram
    participant C as Client
    participant A as Go API
    participant S as Service
    participant DB as PostgreSQL
    participant R as Redis
    participant W as Worker

    C->>A: POST /api/v1/jobs
    A->>S: CreateJob(payload)
    S->>DB: INSERT INTO jobs (status='queued')
    DB-->>S: returns jobID
    S->>R: LPUSH jobs:queue {jobID}
    S-->>A: Job Created
    A-->>C: 201 Created

    Note over R,W: Asynchronous Processing
    W->>R: BRPOP jobs:queue
    R-->>W: {jobID}
    W->>DB: UPDATE jobs SET status='processing'
    Note over W: Process Payload
    W->>DB: UPDATE jobs SET status='completed'
  `;

  diagramBackend = `
flowchart TD
    Req[HTTP Request] --> Router[Router (Chi)]
    Router --> Middleware[Middleware]
    Middleware --> Handler[Handler Layer]
    
    subgraph API Layer
    Handler
    end
    
    Handler --> Service[Service Layer]
    
    subgraph Business Logic
    Service
    end
    
    Service --> Repo[Repository Layer]
    
    subgraph Data Access
    Repo
    end
    
    Repo --> DB[(PostgreSQL)]
    Repo --> Cache[(Redis)]
  `;

  diagramRedis = `
flowchart LR
    API[Go API] -->|LPUSH| Q[(jobs:queue)]
    Q -->|BRPOP| W1[Worker 1]
    Q -->|BRPOP| W2[Worker 2]
    Q -->|BRPOP| W3[Worker 3]
    
    classDef curr fill:#e2e8f0,stroke:#64748b,stroke-width:2px;
    class API,Q,W1,W2,W3 curr;
  `;

  diagramWorkerPool = `
flowchart TD
    Redis[(Redis Queue)] --> Dispatcher[Worker Manager]
    Dispatcher -->|Context + Job| G1((Goroutine 1))
    Dispatcher -->|Context + Job| G2((Goroutine 2))
    Dispatcher -->|Context + Job| GN((Goroutine N))
    
    subgraph WaitGroup
    G1
    G2
    GN
    end
    
    G1 --> DB[(PostgreSQL)]
    G2 --> DB
    GN --> DB
  `;

  diagramLifecycle = `
stateDiagram-v2
    [*] --> queued: Create Job
    queued --> processing: Picked up by Worker
    processing --> completed: Success
    processing --> retry: Failure (attempts < max)
    retry --> queued: Backoff Delay Expired
    processing --> failed: Failure (attempts >= max)
    completed --> [*]
    failed --> [*]
  `;

  diagramRetry = `
flowchart TD
    Proc[Processing Job] --> Fail{Fails?}
    Fail -->|Yes| Attempt{Attempts < Max?}
    Attempt -->|Yes| Calc[Delay = base * 2^attempt]
    Calc --> Wait[Wait Delay]
    Wait --> Requeue[LPUSH to queue]
    Requeue --> Worker[Worker Picks Up]
    Attempt -->|No| Final[Mark Failed in DB]
  `;

  diagramER = `
erDiagram
    JOBS {
        UUID id PK
        VARCHAR type
        JSONB payload
        VARCHAR priority
        VARCHAR status
        INT attempts
        INT max_attempts
        TIMESTAMPTZ scheduled_at
        TIMESTAMPTZ created_at
        TIMESTAMPTZ started_at
        TIMESTAMPTZ completed_at
        TIMESTAMPTZ failed_at
        TEXT error
        VARCHAR worker_id
    }
  `;

  diagramHealth = `
flowchart LR
    Check[Health API] --> API[Go API Status]
    API --> DBCheck{Ping}
    DBCheck -->|OK| DB[(PostgreSQL)]
    API --> RedisCheck{Ping}
    RedisCheck -->|OK| Redis[(Redis)]
  `;

  diagramDevops = `
flowchart LR
    Dev[Developer] -->|Push| Git[GitHub]
    Git -->|Trigger| Actions[GitHub Actions]
    Actions -->|Test & Build| Docker[Docker Image]
    Docker --> Registry[Container Registry]
    Registry --> K8s[Kubernetes Cluster]
    
    classDef planned fill:#fef3c7,stroke:#d97706,stroke-width:2px,stroke-dasharray: 5 5;
    class Registry,K8s planned;
  `;

  diagramK8s = `
flowchart TD
    Ingress[Ingress Controller] --> SvcAPI[API Service]
    SvcAPI --> PodAPI1(API Pod)
    SvcAPI --> PodAPI2(API Pod)
    
    PodW1(Worker Pod)
    PodW2(Worker Pod)
    
    subgraph Stateful
      SvcDB[Postgres Service] --> PodDB[(PostgreSQL)]
      SvcRedis[Redis Service] --> PodRedis[(Redis)]
    end
    
    PodAPI1 --> SvcDB
    PodAPI1 --> SvcRedis
    PodW1 --> SvcDB
    PodW1 --> SvcRedis
    
    classDef planned fill:#fef3c7,stroke:#d97706,stroke-width:2px,stroke-dasharray: 5 5;
    class Ingress,SvcAPI,PodAPI1,PodAPI2,PodW1,PodW2,SvcDB,PodDB,SvcRedis,PodRedis planned;
  `;

  diagramComplete = `
flowchart TD
    User([User Client]) -->|HTTP| Ingress[Ingress/Gateway]
    Ingress --> API[Go REST API]
    
    subgraph Data Layer
      API -->|SQL| DB[(PostgreSQL Master)]
      API -->|Queue| Redis[(Redis Broker)]
    end
    
    subgraph Worker Nodes
      Redis -->|Pub/Sub & Lists| WManager[Worker Manager]
      WManager --> W1[Worker 1]
      WManager --> W2[Worker 2]
      W1 -->|Write Status| DB
      W2 -->|Write Status| DB
    end
    
    subgraph Observability
      API -.->|Metrics| Prom[Prometheus]
      W1 -.->|Logs| Loki[Loki]
      Prom --> Grafana[Grafana Dashboards]
      Loki --> Grafana
    end
    
    classDef curr fill:#e2e8f0,stroke:#64748b,stroke-width:2px;
    classDef planned fill:#fef3c7,stroke:#d97706,stroke-width:2px,stroke-dasharray: 5 5;
    class Prom,Loki,Grafana,Ingress planned;
  `;

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    
    // Find the section currently in view
    for (let i = this.sections.length - 1; i >= 0; i--) {
      const section = this.sections[i];
      const element = document.getElementById(section.id);
      if (element) {
        // 100px offset to trigger highlight slightly before hitting the top
        if (element.offsetTop - 100 <= scrollPosition) {
          this.activeSection = section.id;
          break;
        }
      }
    }
  }

  scrollTo(id: string) {
    if (typeof document === 'undefined') return;
    this.activeSection = id;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
