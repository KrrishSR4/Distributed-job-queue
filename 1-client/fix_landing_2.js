const fs = require('fs');

const path = 'k:/Distributed Job Queue/1-client/src/app/pages/landing/landing.component.js';
let content = fs.readFileSync(path, 'utf8');

const oldFeatures = `          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <!-- Feature 1 -->
            <div class="p-5 bg-slate-50/50 border border-slate-200/80 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group">
              <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h4 class="text-sm font-bold text-slate-900 mb-1">Distributed Workers</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                Distribute jobs across multiple Go workers for parallel processing.
              </p>
            </div>

            <!-- Feature 2 -->
            <div class="p-5 bg-slate-50/50 border border-slate-200/80 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group">
              <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h4 class="text-sm font-bold text-slate-900 mb-1">Reliable Retries</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                Automatically retry failed jobs with controlled retry policies and backoff.
              </p>
            </div>

            <!-- Feature 3 -->
            <div class="p-5 bg-slate-50/50 border border-slate-200/80 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group">
              <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 class="text-sm font-bold text-slate-900 mb-1">Priority Queues</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                Process critical workloads ahead of lower-priority jobs.
              </p>
            </div>

            <!-- Feature 4 -->
            <div class="p-5 bg-slate-50/50 border border-slate-200/80 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group">
              <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 class="text-sm font-bold text-slate-900 mb-1">Job Scheduling</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                Execute jobs at a specific time or on recurring schedules.
              </p>
            </div>

            <!-- Feature 5 -->
            <div class="p-5 bg-slate-50/50 border border-slate-200/80 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group">
              <div class="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h4 class="text-sm font-bold text-slate-900 mb-1">Dead Letter Queue</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                Isolate jobs that repeatedly fail for inspection and recovery.
              </p>
            </div>

            <!-- Feature 6 -->
            <div class="p-5 bg-slate-50/50 border border-slate-200/80 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group">
              <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 class="text-sm font-bold text-slate-900 mb-1">Real-Time Monitoring</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                Track job execution, workers and queues through live dashboard updates.
              </p>
            </div>

            <!-- Feature 7 -->
            <div class="p-5 bg-slate-50/50 border border-slate-200/80 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group">
              <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h4 class="text-sm font-bold text-slate-900 mb-1">Horizontal Scaling</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                Scale API instances and workers independently as workload increases.
              </p>
            </div>

            <!-- Feature 8 -->
            <div class="p-5 bg-slate-50/50 border border-slate-200/80 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group">
              <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h4 class="text-sm font-bold text-slate-900 mb-1">Observability</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                Expose metrics, logs and traces for understanding system health.
              </p>
            </div>

          </div>`;

const newFeatures = `          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <!-- Feature 1 -->
            <div class="p-5 bg-slate-50/50 border border-slate-200/80 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group relative">
              <div class="absolute top-3 right-3 text-[9px] font-bold tracking-widest text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">IMPLEMENTED</div>
              <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h4 class="text-sm font-bold text-slate-900 mb-1">Distributed Workers</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                Distribute jobs across multiple Go worker goroutines for parallel processing.
              </p>
            </div>

            <!-- Feature 2 -->
            <div class="p-5 bg-slate-50/50 border border-slate-200/80 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group relative">
              <div class="absolute top-3 right-3 text-[9px] font-bold tracking-widest text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">IMPLEMENTED</div>
              <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h4 class="text-sm font-bold text-slate-900 mb-1">Reliable Retries</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                Automatically retry failed jobs with controlled retry policies and exponential backoff.
              </p>
            </div>

            <!-- Feature 3 -->
            <div class="p-5 bg-slate-50/50 border border-slate-200/80 rounded-xl group relative opacity-80">
              <div class="absolute top-3 right-3 text-[9px] font-bold tracking-widest text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">PLANNED</div>
              <div class="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 class="text-sm font-bold text-slate-900 mb-1">Priority Queues</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                Process critical workloads ahead of lower-priority jobs.
              </p>
            </div>

            <!-- Feature 4 -->
            <div class="p-5 bg-slate-50/50 border border-slate-200/80 rounded-xl group relative opacity-80">
              <div class="absolute top-3 right-3 text-[9px] font-bold tracking-widest text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">PLANNED</div>
              <div class="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 class="text-sm font-bold text-slate-900 mb-1">Job Scheduling</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                Execute jobs at a specific time or on recurring schedules.
              </p>
            </div>

            <!-- Feature 5 -->
            <div class="p-5 bg-slate-50/50 border border-slate-200/80 rounded-xl group relative opacity-80">
              <div class="absolute top-3 right-3 text-[9px] font-bold tracking-widest text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">PLANNED</div>
              <div class="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h4 class="text-sm font-bold text-slate-900 mb-1">Dead Letter Queue</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                Isolate jobs that repeatedly fail for inspection and recovery.
              </p>
            </div>

            <!-- Feature 6 -->
            <div class="p-5 bg-slate-50/50 border border-slate-200/80 rounded-xl group relative opacity-80">
              <div class="absolute top-3 right-3 text-[9px] font-bold tracking-widest text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">PLANNED</div>
              <div class="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 class="text-sm font-bold text-slate-900 mb-1">Live Push Engine</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                WebSocket based real-time execution updates pushed directly to the UI.
              </p>
            </div>

            <!-- Feature 7 -->
            <div class="p-5 bg-slate-50/50 border border-slate-200/80 rounded-xl group relative opacity-80">
              <div class="absolute top-3 right-3 text-[9px] font-bold tracking-widest text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">PLANNED</div>
              <div class="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h4 class="text-sm font-bold text-slate-900 mb-1">Horizontal Scaling</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                Scale API instances and workers across multiple cloud nodes dynamically.
              </p>
            </div>

            <!-- Feature 8 -->
            <div class="p-5 bg-slate-50/50 border border-slate-200/80 rounded-xl group relative opacity-80">
              <div class="absolute top-3 right-3 text-[9px] font-bold tracking-widest text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">PLANNED</div>
              <div class="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h4 class="text-sm font-bold text-slate-900 mb-1">Observability</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                Expose Prometheus metrics, Grafana dashboards, and OpenTelemetry traces.
              </p>
            </div>

          </div>`;

content = content.replace(oldFeatures, newFeatures);

// Next: Section 5 Reliability
const oldDLQLifecycle = `            <!-- Quarantine DLQ Path Lifecycle -->
            <div class="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2">
              <div class="text-xs font-bold text-slate-800">3. DLQ Isolation Path</div>
              <div class="flex items-center gap-2 font-mono text-xs">
                <span class="px-2 py-0.5 rounded bg-rose-100 text-rose-800">Failed</span>
                <span>➔</span>
                <span class="px-2 py-0.5 rounded bg-rose-200 text-rose-900 font-bold">Max Retries</span>
                <span>➔</span>
                <span class="px-2.5 py-0.5 rounded bg-slate-900 text-rose-300 font-bold">Dead Letter Queue</span>
              </div>
            </div>`;
const newDLQLifecycle = `            <!-- Final Failure Path Lifecycle -->
            <div class="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2">
              <div class="text-xs font-bold text-slate-800">3. Final Failure Path (FUTURE: DLQ)</div>
              <div class="flex items-center gap-2 font-mono text-xs">
                <span class="px-2 py-0.5 rounded bg-rose-100 text-rose-800">Failed</span>
                <span>➔</span>
                <span class="px-2 py-0.5 rounded bg-rose-200 text-rose-900 font-bold">Max Retries</span>
                <span>➔</span>
                <span class="px-2.5 py-0.5 rounded bg-slate-900 text-rose-300 font-bold">Final Failure</span>
              </div>
            </div>`;

content = content.replace(oldDLQLifecycle, newDLQLifecycle);

const oldWorkerHeartbeat = `            <div class="p-4 bg-white border border-slate-200/80 rounded-xl space-y-1.5">
              <div class="text-xs font-bold text-slate-900">Worker Heartbeat & Recovery</div>
              <p class="text-xs text-slate-600 leading-relaxed">
                If a worker node crashes mid-execution, orphaned jobs are detected and automatically re-queued.
              </p>
            </div>`;
const newWorkerHeartbeat = `            <div class="p-4 bg-white border border-slate-200/80 rounded-xl space-y-1.5">
              <div class="text-xs font-bold text-slate-900">Worker Concurrency Control</div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Goroutines manage job processing asynchronously, allowing efficient local concurrency without blocking.
              </p>
            </div>`;
content = content.replace(oldWorkerHeartbeat, newWorkerHeartbeat);

// Horizontal Scaling section (Task 2)
const oldScalingSec = `          <div class="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 class="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600">Elastic Architecture</h2>
            <h3 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Independent Horizontal Scaling</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              API servers and workers scale independently. Scaling execution capacity requires zero changes or downtime on the API gateway.
            </p>
          </div>

          <!-- Scaling Topology Visual -->
          <div class="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto font-mono text-xs shadow-xl mb-12">
            <div class="text-center text-slate-400 text-[11px] mb-6 border-b border-slate-800 pb-3">
              CLUSTER TOPOLOGY & LOAD BALANCING
            </div>

            <!-- Load Balancer -->
            <div class="flex justify-center mb-4">
              <div class="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg border border-blue-400 shadow-sm">
                NGINX / Cloud Load Balancer
              </div>
            </div>

            <!-- Down Arrows -->
            <div class="flex justify-center mb-4 text-blue-400 font-bold">
              <span>│ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; │ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; │</span>
            </div>

            <!-- API Instances Layer -->
            <div class="grid grid-cols-3 gap-4 text-center mb-6">
              <div class="p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200">
                Go API Server 1
              </div>
              <div class="p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200">
                Go API Server 2
              </div>
              <div class="p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200">
                Go API Server N
              </div>
            </div>

            <!-- Central Redis Queue -->
            <div class="flex justify-center my-6">
              <div class="px-8 py-3 bg-rose-950/80 border border-rose-500 text-rose-300 font-bold rounded-xl text-center">
                Redis Central In-Memory Broker (Priority ZSETs)
              </div>
            </div>

            <!-- Worker Instances Layer -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div class="p-3 bg-slate-800 border border-purple-500/40 rounded-lg text-purple-300">
                Go Worker Node 1 (8 Goroutines)
              </div>
              <div class="p-3 bg-slate-800 border border-purple-500/40 rounded-lg text-purple-300">
                Go Worker Node 2 (8 Goroutines)
              </div>
              <div class="p-3 bg-slate-800 border border-purple-500/40 rounded-lg text-purple-300">
                Go Worker Node N (Auto-Scaled)
              </div>
            </div>
          </div>`;

const newScalingSec = `          <div class="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-mono font-bold tracking-wider mb-2">
              PLANNED ARCHITECTURE
            </div>
            <h3 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Horizontal Scaling Model</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              <strong>Current Implementation:</strong> Single Go API & Configurable Goroutine Worker Pool.<br>
              <strong>Future Scaling:</strong> API servers and workers scale independently. Scaling execution capacity requires zero changes or downtime on the API gateway.
            </p>
          </div>

          <!-- Scaling Topology Visual -->
          <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto font-mono text-xs shadow-sm mb-12">
            <div class="text-center font-bold text-slate-900 text-[11px] tracking-widest uppercase mb-6 border-b border-slate-100 pb-3">
              PLANNED CLUSTER TOPOLOGY
            </div>

            <!-- Load Balancer -->
            <div class="flex justify-center mb-4 relative z-10">
              <div class="px-6 py-2 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200 shadow-sm">
                Load Balancer
              </div>
            </div>

            <!-- Split Lines from LB to API -->
            <div class="w-full relative h-8 -mt-4 mb-2 z-0">
               <div class="absolute top-1/2 left-[16.6%] right-[16.6%] h-px bg-slate-200"></div>
               <div class="absolute top-0 left-1/2 w-px h-1/2 bg-slate-200"></div>
               <div class="absolute top-1/2 left-[16.6%] w-px h-1/2 bg-slate-200"></div>
               <div class="absolute top-1/2 left-1/2 w-px h-1/2 bg-slate-200"></div>
               <div class="absolute top-1/2 right-[16.6%] w-px h-1/2 bg-slate-200"></div>
            </div>

            <!-- API Instances Layer -->
            <div class="flex justify-between gap-4 text-center mb-2 z-10 relative px-4">
              <div class="flex-1 p-3 bg-white border border-slate-200 shadow-sm rounded-lg text-slate-700 font-bold">API 1</div>
              <div class="flex-1 p-3 bg-white border border-slate-200 shadow-sm rounded-lg text-slate-700 font-bold">API 2</div>
              <div class="flex-1 p-3 bg-white border border-slate-200 shadow-sm rounded-lg text-slate-700 font-bold">API N</div>
            </div>

            <!-- Merge Lines from API to Redis -->
            <div class="w-full relative h-8 -mt-2 mb-4 z-0">
               <div class="absolute top-1/2 left-[16.6%] right-[16.6%] h-px bg-slate-200"></div>
               <div class="absolute top-0 left-[16.6%] w-px h-1/2 bg-slate-200"></div>
               <div class="absolute top-0 left-1/2 w-px h-1/2 bg-slate-200"></div>
               <div class="absolute top-0 right-[16.6%] w-px h-1/2 bg-slate-200"></div>
               <div class="absolute top-1/2 left-1/2 w-px h-1/2 bg-slate-200"></div>
            </div>

            <!-- Central Redis Queue -->
            <div class="flex justify-center mb-4 z-10 relative">
              <div class="px-8 py-3 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xl text-center shadow-sm">
                Redis Queue Broker
              </div>
            </div>

            <!-- Split Lines from Redis to Workers -->
            <div class="w-full relative h-8 -mt-4 mb-2 z-0">
               <div class="absolute top-1/2 left-[16.6%] right-[16.6%] h-px bg-slate-200"></div>
               <div class="absolute top-0 left-1/2 w-px h-1/2 bg-slate-200"></div>
               <div class="absolute top-1/2 left-[16.6%] w-px h-1/2 bg-slate-200"></div>
               <div class="absolute top-1/2 left-1/2 w-px h-1/2 bg-slate-200"></div>
               <div class="absolute top-1/2 right-[16.6%] w-px h-1/2 bg-slate-200"></div>
            </div>

            <!-- Worker Instances Layer -->
            <div class="flex justify-between gap-4 text-center z-10 relative px-4">
              <div class="flex-1 p-3 bg-white border border-slate-200 shadow-sm rounded-lg text-slate-700 font-bold">Worker Node 1</div>
              <div class="flex-1 p-3 bg-white border border-slate-200 shadow-sm rounded-lg text-slate-700 font-bold">Worker Node 2</div>
              <div class="flex-1 p-3 bg-white border border-slate-200 shadow-sm rounded-lg text-slate-700 font-bold">Worker Node N</div>
            </div>
          </div>`;

content = content.replace(oldScalingSec, newScalingSec);

fs.writeFileSync(path, content);
console.log('Fixed features & scaling!');
