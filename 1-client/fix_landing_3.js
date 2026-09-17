const fs = require('fs');

const path = 'k:/Distributed Job Queue/1-client/src/app/pages/landing/landing.component.js';
let content = fs.readFileSync(path, 'utf8');

// Remove Supporting Systems
const oldSupportingSystems = `          <!-- Supporting Systems -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            
            <div class="p-5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <div class="text-xs font-mono font-bold text-slate-800">Observability Stack</div>
              <div class="flex flex-wrap gap-2 text-xs font-mono">
                <span class="px-2 py-1 bg-white border border-slate-200 rounded">Prometheus</span>
                <span class="px-2 py-1 bg-white border border-slate-200 rounded">Grafana</span>
                <span class="px-2 py-1 bg-white border border-slate-200 rounded">Loki</span>
                <span class="px-2 py-1 bg-white border border-slate-200 rounded">OpenTelemetry</span>
              </div>
            </div>

            <div class="p-5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <div class="text-xs font-mono font-bold text-slate-800">Deployment & CI/CD</div>
              <div class="flex flex-wrap gap-2 text-xs font-mono">
                <span class="px-2 py-1 bg-white border border-slate-200 rounded">Docker</span>
                <span class="px-2 py-1 bg-white border border-slate-200 rounded">Kubernetes</span>
                <span class="px-2 py-1 bg-white border border-slate-200 rounded">GitHub Actions</span>
                <span class="px-2 py-1 bg-white border border-slate-200 rounded">Terraform</span>
              </div>
            </div>

          </div>`;
content = content.replace(oldSupportingSystems, '');

// Update Technology Stack
const oldTechStack = `          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <!-- Tech 1: Frontend -->
            <div class="p-6 bg-slate-50/50 border border-slate-200/80 rounded-xl space-y-4 hover:border-slate-300 transition-colors">
              <div class="flex items-center gap-3">
                <img src="https://skillicons.dev/icons?i=angular,js" alt="Angular & JS" class="h-8" />
                <h4 class="font-bold text-slate-900 text-sm">Frontend Dashboard</h4>
              </div>
              <ul class="space-y-2 text-xs font-mono text-slate-600">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Angular 20 Standalone</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>JavaScript Application Logic</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Tailwind CSS v4 Design Tokens</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>RxJS Reactive Streams</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Apache ECharts Visualization</li>
              </ul>
            </div>

            <!-- Tech 2: Backend -->
            <div class="p-6 bg-slate-50/50 border border-slate-200/80 rounded-xl space-y-4 hover:border-slate-300 transition-colors">
              <div class="flex items-center gap-3">
                <img src="https://skillicons.dev/icons?i=go" alt="Go" class="h-8" />
                <h4 class="font-bold text-slate-900 text-sm">Backend Engine</h4>
              </div>
              <ul class="space-y-2 text-xs font-mono text-slate-600">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Go (Golang 1.22 runtime)</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>RESTful API Gateway</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>WebSocket Real-Time Engine</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Goroutines & Worker Pools</li>
              </ul>
            </div>

            <!-- Tech 3: Data Layer -->
            <div class="p-6 bg-slate-50/50 border border-slate-200/80 rounded-xl space-y-4 hover:border-slate-300 transition-colors">
              <div class="flex items-center gap-3">
                <img src="https://skillicons.dev/icons?i=redis,postgres" alt="Redis & Postgres" class="h-8" />
                <h4 class="font-bold text-slate-900 text-sm">Data & Message Layer</h4>
              </div>
              <ul class="space-y-2 text-xs font-mono text-slate-600">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Redis 7 In-Memory Broker</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Redis Pub/Sub Event Bus</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>PostgreSQL 16 Storage</li>
              </ul>
            </div>

            <!-- Tech 4: Infrastructure -->
            <div class="p-6 bg-slate-50/50 border border-slate-200/80 rounded-xl space-y-4 hover:border-slate-300 transition-colors">
              <div class="flex items-center gap-3">
                <img src="https://skillicons.dev/icons?i=kubernetes,docker" alt="Kubernetes & Docker" class="h-8" />
                <h4 class="font-bold text-slate-900 text-sm">Infrastructure</h4>
              </div>
              <ul class="space-y-2 text-xs font-mono text-slate-600">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Docker Containerization</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Kubernetes Orchestration</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Terraform Infrastructure as Code</li>
              </ul>
            </div>

            <!-- Tech 5: CI/CD -->
            <div class="p-6 bg-slate-50/50 border border-slate-200/80 rounded-xl space-y-4 hover:border-slate-300 transition-colors">
              <div class="flex items-center gap-3">
                <img src="https://skillicons.dev/icons?i=githubactions" alt="GitHub Actions" class="h-8" />
                <h4 class="font-bold text-slate-900 text-sm">CI/CD Pipeline</h4>
              </div>
              <ul class="space-y-2 text-xs font-mono text-slate-600">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>GitHub Actions Automated Workflows</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Automated Testing & Build Pipeline</li>
              </ul>
            </div>

            <!-- Tech 6: Observability -->
            <div class="p-6 bg-slate-50/50 border border-slate-200/80 rounded-xl space-y-4 hover:border-slate-300 transition-colors">
              <div class="flex items-center gap-3">
                <img src="https://skillicons.dev/icons?i=prometheus,grafana" alt="Prometheus & Grafana" class="h-8" />
                <h4 class="font-bold text-slate-900 text-sm">Observability Stack</h4>
              </div>
              <ul class="space-y-2 text-xs font-mono text-slate-600">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Prometheus Metrics Export</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Grafana Real-time Dashboards</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Loki Log Aggregation</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>OpenTelemetry Tracing</li>
              </ul>
            </div>

          </div>`;

const newTechStack = `          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <!-- Tech 1: Frontend -->
            <div class="p-6 bg-slate-50/50 border border-slate-200/80 rounded-xl space-y-4 hover:border-slate-300 transition-colors relative">
              <div class="flex items-center gap-3">
                <img src="https://skillicons.dev/icons?i=angular,js" alt="Angular & JS" class="h-8" />
                <h4 class="font-bold text-slate-900 text-sm">Frontend Dashboard</h4>
              </div>
              <ul class="space-y-2 text-xs font-mono text-slate-600">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Angular 20 Standalone</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>JavaScript Application Logic</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Tailwind CSS v4 Design Tokens</li>
              </ul>
            </div>

            <!-- Tech 2: Backend -->
            <div class="p-6 bg-slate-50/50 border border-slate-200/80 rounded-xl space-y-4 hover:border-slate-300 transition-colors relative">
              <div class="flex items-center gap-3">
                <img src="https://skillicons.dev/icons?i=go" alt="Go" class="h-8" />
                <h4 class="font-bold text-slate-900 text-sm">Backend Engine</h4>
              </div>
              <ul class="space-y-2 text-xs font-mono text-slate-600">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Go (Golang 1.22 runtime)</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>RESTful API Gateway</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Goroutines & Worker Pools</li>
              </ul>
            </div>

            <!-- Tech 3: Data Layer -->
            <div class="p-6 bg-slate-50/50 border border-slate-200/80 rounded-xl space-y-4 hover:border-slate-300 transition-colors relative">
              <div class="flex items-center gap-3">
                <img src="https://skillicons.dev/icons?i=redis,postgres" alt="Redis & Postgres" class="h-8" />
                <h4 class="font-bold text-slate-900 text-sm">Data & Message Layer</h4>
              </div>
              <ul class="space-y-2 text-xs font-mono text-slate-600">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Redis In-Memory Queue (List)</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>PostgreSQL 16 Storage</li>
              </ul>
            </div>

            <!-- Tech 4: Infrastructure -->
            <div class="p-6 bg-slate-50/50 border border-slate-200/80 rounded-xl space-y-4 hover:border-slate-300 transition-colors relative">
              <div class="flex items-center gap-3">
                <img src="https://skillicons.dev/icons?i=docker" alt="Docker" class="h-8" />
                <h4 class="font-bold text-slate-900 text-sm">Infrastructure</h4>
              </div>
              <ul class="space-y-2 text-xs font-mono text-slate-600">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Docker Containerization</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Docker Compose Workflows</li>
              </ul>
            </div>
            
            <!-- Tech 5: Planned Infrastructure -->
            <div class="p-6 bg-slate-50/50 border border-slate-200/80 rounded-xl space-y-4 hover:border-slate-300 transition-colors relative opacity-75">
              <div class="absolute top-3 right-3 text-[9px] font-bold tracking-widest text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">PLANNED</div>
              <div class="flex items-center gap-3">
                <img src="https://skillicons.dev/icons?i=kubernetes,terraform" alt="K8s & Terraform" class="h-8" />
                <h4 class="font-bold text-slate-900 text-sm">Scale & Ops</h4>
              </div>
              <ul class="space-y-2 text-xs font-mono text-slate-600">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Kubernetes Orchestration</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Terraform Infrastructure as Code</li>
              </ul>
            </div>

            <!-- Tech 6: Planned Observability -->
            <div class="p-6 bg-slate-50/50 border border-slate-200/80 rounded-xl space-y-4 hover:border-slate-300 transition-colors relative opacity-75">
              <div class="absolute top-3 right-3 text-[9px] font-bold tracking-widest text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">PLANNED</div>
              <div class="flex items-center gap-3">
                <img src="https://skillicons.dev/icons?i=prometheus,grafana" alt="Prometheus & Grafana" class="h-8" />
                <h4 class="font-bold text-slate-900 text-sm">Observability Stack</h4>
              </div>
              <ul class="space-y-2 text-xs font-mono text-slate-600">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Prometheus Metrics Export</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Grafana Real-time Dashboards</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Loki Log Aggregation</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>OpenTelemetry Tracing</li>
              </ul>
            </div>

          </div>`;
content = content.replace(oldTechStack, newTechStack);

fs.writeFileSync(path, content);
console.log('Fixed tech stack in landing!');
