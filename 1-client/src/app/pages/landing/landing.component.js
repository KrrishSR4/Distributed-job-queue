import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div id="top" class="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      
      <!-- ========================================== -->
      <!-- STICKY NAVBAR                              -->
      <!-- ========================================== -->
      <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <!-- Left: Logo & Brand -->
          <a routerLink="/" class="flex items-center gap-2 group">
            <div class="flex flex-col">
              <span class="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">JobQueue</span>
              <span class="text-[10px] text-slate-500 font-mono hidden sm:inline">Distributed Engine</span>
            </div>
          </a>

          <!-- Center: Navigation Links -->
          <nav class="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
            <a routerLink="/docs" class="hover:text-blue-600 transition-colors cursor-pointer font-bold">Documentation</a>
            <button (click)="scrollToSection('how-it-works')" class="hover:text-blue-600 transition-colors cursor-pointer">How It Works</button>
            <button (click)="scrollToSection('features')" class="hover:text-blue-600 transition-colors cursor-pointer">Features</button>
            <button (click)="scrollToSection('reliability')" class="hover:text-blue-600 transition-colors cursor-pointer">Reliability</button>
            <button (click)="scrollToSection('architecture')" class="hover:text-blue-600 transition-colors cursor-pointer">Architecture</button>
            <button (click)="scrollToSection('scaling')" class="hover:text-blue-600 transition-colors cursor-pointer">Scaling</button>
            <button (click)="scrollToSection('technology')" class="hover:text-blue-600 transition-colors cursor-pointer">Technology</button>
          </nav>

          <!-- Right: Primary CTA -->
          <div class="flex items-center gap-3">
            <a routerLink="/dashboard" 
               class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow transition-all flex items-center gap-1.5">
              <span>Go to Dashboard</span>
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

        </div>
      </header>

      <!-- ========================================== -->
      <!-- SECTION 1 — INTRODUCTION / HERO            -->
      <!-- ========================================== -->
      <section class="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div class="lg:col-span-7 space-y-6">
            <!-- Badge -->
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-mono font-medium">
              <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              High-Throughput Asynchronous Task Engine
            </div>

            <!-- Headline -->
            <h1 class="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Distributed Job Processing, Built for Scale.
            </h1>

            <!-- Supporting Text -->
            <p class="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              An asynchronous job processing platform that queues background tasks and distributes execution across scalable Go workers with reliable retries, scheduling and real-time monitoring.
            </p>

            <!-- Action Buttons -->
            <div class="pt-2 flex flex-wrap items-center gap-4">
              <a routerLink="/dashboard" 
                 class="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                <span>Go to Dashboard</span>
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>

              <a routerLink="/docs" 
                 class="px-5 py-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-sm font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer">
                <span>Explore Documentation</span>
                <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </a>
            </div>

            <!-- Key Metrics Bar -->
            <div class="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80">
              <div>
                <div class="text-sm font-bold font-sans text-slate-900">Concurrent</div>
                <div class="text-xs text-slate-500 font-sans">Job Processing</div>
              </div>
              <div>
                <div class="text-sm font-bold font-sans text-slate-900">Redis-Backed</div>
                <div class="text-xs text-slate-500 font-sans">Queue Engine</div>
              </div>
              <div>
                <div class="text-sm font-bold font-sans text-emerald-600">Resilient</div>
                <div class="text-xs text-slate-500 font-sans">Failure Recovery</div>
              </div>
            </div>

          </div>

          <!-- Subtle Animated System Representation -->
          <div class="lg:col-span-5">
            <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-slate-200"></span>
                  <span class="w-3 h-3 rounded-full bg-slate-200"></span>
                  <span class="w-3 h-3 rounded-full bg-slate-200"></span>
                </div>
                <span class="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Architecture Preview</span>
              </div>

              <!-- Animated Node Flow -->
              <div class="flex flex-col items-center font-mono text-xs w-full px-4">
                
                <!-- Go API -->
                <div class="w-48 p-2 bg-white border border-slate-200 shadow-sm rounded-lg flex items-center justify-center gap-2 z-10 relative">
                  <span class="text-blue-600 font-bold">Go API</span>
                </div>

                <!-- Line -->
                <div class="h-6 w-px bg-slate-300"></div>

                <!-- Redis Queue -->
                <div class="w-48 p-2 bg-white border border-slate-200 shadow-sm rounded-lg flex items-center justify-center gap-2 z-10 relative">
                  <span class="text-rose-600 font-bold">Redis Queue</span>
                </div>

                <!-- Split Lines to Workers -->
                <div class="w-full relative h-6">
                  <div class="absolute top-1/2 left-[16.6%] right-[16.6%] h-px bg-slate-300"></div>
                  <div class="absolute top-0 left-1/2 w-px h-1/2 bg-slate-300"></div>
                  <div class="absolute top-1/2 left-[16.6%] w-px h-1/2 bg-slate-300"></div>
                  <div class="absolute top-1/2 left-1/2 w-px h-1/2 bg-slate-300"></div>
                  <div class="absolute top-1/2 right-[16.6%] w-px h-1/2 bg-slate-300"></div>
                </div>

                <!-- Workers -->
                <div class="w-full flex justify-between gap-3 z-10 relative">
                  <div class="flex-1 p-2 bg-white border border-slate-200 shadow-sm rounded-lg text-center text-slate-700">Worker 1</div>
                  <div class="flex-1 p-2 bg-white border border-slate-200 shadow-sm rounded-lg text-center text-slate-700">Worker 2</div>
                  <div class="flex-1 p-2 bg-white border border-slate-200 shadow-sm rounded-lg text-center text-slate-700">Worker N</div>
                </div>

                <!-- Merge Lines to PostgreSQL -->
                <div class="w-full relative h-6">
                  <div class="absolute top-1/2 left-[16.6%] right-[16.6%] h-px bg-slate-300"></div>
                  <div class="absolute top-0 left-[16.6%] w-px h-1/2 bg-slate-300"></div>
                  <div class="absolute top-0 left-1/2 w-px h-1/2 bg-slate-300"></div>
                  <div class="absolute top-0 right-[16.6%] w-px h-1/2 bg-slate-300"></div>
                  <div class="absolute top-1/2 left-1/2 w-px h-1/2 bg-slate-300"></div>
                </div>

                <!-- PostgreSQL -->
                <div class="w-48 p-2 bg-white border border-slate-200 shadow-sm rounded-lg flex items-center justify-center gap-2 z-10 relative">
                  <span class="text-emerald-600 font-bold">PostgreSQL</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- ========================================== -->
      <!-- SECTION 2 — WHAT IS A DISTRIBUTED JOB QUEUE -->
      <!-- ========================================== -->
      <section id="how-it-works" class="py-16 bg-white border-y border-slate-200/80">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <h2 class="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600">Architectural Problem & Solution</h2>
            <h3 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Move Heavy Work Out of the Request Path</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Synchronous APIs fail when handling compute-heavy operations. Offloading execution to background queues guarantees low API latency and system resilience.
            </p>
          </div>

          <!-- Comparison Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            <!-- Without Queue -->
            <div class="bg-rose-50/50 border border-rose-200/90 rounded-2xl p-6 relative">
              <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-rose-100 text-rose-800 text-xs font-bold font-mono mb-4">
                ❌ WITHOUT JOB QUEUE (Synchronous)
              </div>
              <p class="text-xs text-rose-900 mb-6 leading-relaxed">
                User requests wait for PDF generation, video encoding, or database indexing to complete on the HTTP handler thread.
              </p>

              <div class="space-y-3 font-mono text-xs">
                <div class="p-3 bg-white border border-rose-200 rounded-lg flex items-center justify-between">
                  <span class="text-slate-700">User HTTP Request</span>
                  <span class="text-slate-400">➔</span>
                </div>
                <div class="p-3 bg-white border border-rose-300 rounded-lg flex items-center justify-between">
                  <span class="text-rose-700 font-bold">API Handler (Blocked 5.2 seconds)</span>
                  <span class="text-rose-500 font-bold">High Latency</span>
                </div>
                <div class="p-3 bg-rose-100 text-rose-900 rounded-lg font-bold flex items-center justify-between">
                  <span>504 Gateway Timeout Risk</span>
                  <span>FAILED SLA</span>
                </div>
              </div>
            </div>

            <!-- With Queue -->
            <div class="bg-emerald-50/50 border border-emerald-200/90 rounded-2xl p-6 relative">
              <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold font-mono mb-4">
                ✅ WITH DISTRIBUTED QUEUE (Asynchronous)
              </div>
              <p class="text-xs text-emerald-900 mb-6 leading-relaxed">
                API immediately returns 202 Accepted in 12ms. Go workers pick up jobs from Redis and process them asynchronously in parallel.
              </p>

              <div class="space-y-3 font-mono text-xs">
                <div class="p-3 bg-white border border-emerald-200 rounded-lg flex items-center justify-between">
                  <span class="text-slate-700">User HTTP Request</span>
                  <span class="text-emerald-600 font-bold">202 Accepted (12ms)</span>
                </div>
                <div class="p-3 bg-white border border-emerald-300 rounded-lg flex items-center justify-between">
                  <span class="text-blue-700 font-bold">Redis Queue Broker</span>
                  <span class="text-blue-600">Buffered</span>
                </div>
                <div class="p-3 bg-emerald-100 text-emerald-900 rounded-lg font-bold flex items-center justify-between">
                  <span>Go Worker Pool Execution</span>
                  <span>PARALLEL & RESILIENT</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Use Case Badges -->
          <div class="border-t border-slate-200 pt-8">
            <div class="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">Production Workload Examples</div>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
              <div class="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-slate-300 transition-colors">
                <div class="text-slate-600">
                  <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div class="text-xs font-bold text-slate-800">Transactional Emails</div>
              </div>
              <div class="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-slate-300 transition-colors">
                <div class="text-slate-600">
                  <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div class="text-xs font-bold text-slate-800">Media Transcoding</div>
              </div>
              <div class="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-slate-300 transition-colors">
                <div class="text-slate-600">
                  <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div class="text-xs font-bold text-slate-800">PDF & Report Generation</div>
              </div>
              <div class="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-slate-300 transition-colors">
                <div class="text-slate-600">
                  <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <div class="text-xs font-bold text-slate-800">ETL & Data Pipelines</div>
              </div>
              <div class="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-slate-300 transition-colors">
                <div class="text-slate-600">
                  <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div class="text-xs font-bold text-slate-800">Scheduled Cron Jobs</div>
              </div>
              <div class="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-slate-300 transition-colors">
                <div class="text-slate-600">
                  <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                  </svg>
                </div>
                <div class="text-xs font-bold text-slate-800">AI Background Tasks</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- ========================================== -->
      <!-- SECTION 3 — HOW IT WORKS (VISUAL WORKFLOW) -->
      <!-- ========================================== -->
      <section class="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div class="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <h2 class="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600">End-to-End Workflow</h2>
          <h3 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">How Jobs Travel Through the Engine</h3>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <!-- Workflow 1: Success Path -->
          <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <span class="text-xs font-bold text-slate-900 font-mono">PRIMARY EXECUTION PIPELINE</span>
              <span class="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200">Success Path</span>
            </div>

            <div class="space-y-4 font-mono text-xs">
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0">1</div>
                <div class="p-3 bg-slate-50 rounded-lg flex-1 border border-slate-200/60">
                  <div class="font-bold text-slate-900">Angular Dashboard / Client</div>
                  <div class="text-[11px] text-slate-500">Submits job payload via REST API</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0">2</div>
                <div class="p-3 bg-slate-50 rounded-lg flex-1 border border-slate-200/60">
                  <div class="font-bold text-slate-900">Go API Gateway</div>
                  <div class="text-[11px] text-slate-500">Validates payload & generates UUID</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0">3</div>
                <div class="p-3 bg-slate-50 rounded-lg flex-1 border border-slate-200/60">
                  <div class="font-bold text-slate-900">PostgreSQL Database</div>
                  <div class="text-[11px] text-slate-500">Stores initial state (status: PENDING)</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0">4</div>
                <div class="p-3 bg-slate-50 rounded-lg flex-1 border border-slate-200/60">
                  <div class="font-bold text-slate-900">Redis Queue Broker</div>
                  <div class="text-[11px] text-slate-500">Pushes payload to atomic ZSET / List</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0">5</div>
                <div class="p-3 bg-slate-50 rounded-lg flex-1 border border-slate-200/60">
                  <div class="font-bold text-slate-900">Go Worker Pool</div>
                  <div class="text-[11px] text-slate-500">Pulls job & executes in isolated goroutine</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center flex-shrink-0">6</div>
                <div class="p-3 bg-emerald-50 rounded-lg flex-1 border border-emerald-200 text-emerald-900">
                  <div class="font-bold">Result Saved & WebSockets Broadcasted</div>
                  <div class="text-[11px] text-emerald-700">Real-time update pushed to Live Dashboard</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Workflow 2: Failure & Recovery Path -->
          <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <span class="text-xs font-bold text-slate-900 font-mono">FAILURE & RECOVERY PIPELINE</span>
              <span class="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded border border-amber-200">Retry Mechanism</span>
            </div>

            <div class="space-y-4 font-mono text-xs">
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center flex-shrink-0">1</div>
                <div class="p-3 bg-slate-50 rounded-lg flex-1 border border-slate-200/60">
                  <div class="font-bold text-slate-900">Go Worker Processing</div>
                  <div class="text-[11px] text-slate-500">Attempts processing payload</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center flex-shrink-0">2</div>
                <div class="p-3 bg-amber-50 rounded-lg flex-1 border border-amber-200 text-amber-900">
                  <div class="font-bold">Failure Detected</div>
                  <div class="text-[11px] text-amber-700">Network timeout / DB lock / API Error</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0">3</div>
                <div class="p-3 bg-slate-50 rounded-lg flex-1 border border-slate-200/60">
                  <div class="font-bold text-slate-900">Retry Allowed? (YES)</div>
                  <div class="text-[11px] text-slate-500">Checks current attempts vs max_attempts</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0">4</div>
                <div class="p-3 bg-slate-50 rounded-lg flex-1 border border-slate-200/60">
                  <div class="font-bold text-slate-900">Exponential Backoff Delay</div>
                  <div class="text-[11px] text-slate-500">Calculates delay (2s ➔ 4s ➔ 8s)</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0">5</div>
                <div class="p-3 bg-slate-50 rounded-lg flex-1 border border-slate-200/60">
                  <div class="font-bold text-slate-900">Re-queued to Redis</div>
                  <div class="text-[11px] text-slate-500">Increments retry counter (Attempt 2/3)</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center flex-shrink-0">6</div>
                <div class="p-3 bg-rose-50 rounded-lg flex-1 border border-rose-200 text-rose-900">
                  <div class="font-bold">Max Retries Exceeded</div>
                  <div class="text-[11px] text-rose-700">Final failure (FUTURE: Move to DLQ)</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- ========================================== -->
      <!-- SECTION 4 — CORE FEATURES                  -->
      <!-- ========================================== -->
      <section id="features" class="py-16 bg-white border-y border-slate-200/80">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 class="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600">Built for Enterprise Infrastructure</h2>
            <h3 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Core Platform Capabilities</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
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

          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- SECTION 5 — RELIABILITY                    -->
      <!-- ========================================== -->
      <section id="reliability" class="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div class="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <h2 class="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600">Fault Tolerance & Recovery</h2>
          <h3 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Zero Job Loss Guarantee</h3>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <!-- Lifecycle Visual Column -->
          <div class="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            <h4 class="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">Job State Transition Lifecycles</h4>

            <!-- Success Path Lifecycle -->
            <div class="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2">
              <div class="text-xs font-bold text-slate-800">1. Standard Completion Path</div>
              <div class="flex items-center gap-2 font-mono text-xs">
                <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-700">Created</span>
                <span>➔</span>
                <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-800">Queued</span>
                <span>➔</span>
                <span class="px-2 py-0.5 rounded bg-purple-100 text-purple-800">Processing</span>
                <span>➔</span>
                <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Completed</span>
              </div>
            </div>

            <!-- Retry Path Lifecycle -->
            <div class="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2">
              <div class="text-xs font-bold text-slate-800">2. Exponential Retry Recovery</div>
              <div class="flex items-center gap-2 font-mono text-xs">
                <span class="px-2 py-0.5 rounded bg-purple-100 text-purple-800">Processing</span>
                <span>➔</span>
                <span class="px-2 py-0.5 rounded bg-rose-100 text-rose-800">Failed</span>
                <span>➔</span>
                <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-800">Retry (2s delay)</span>
                <span>➔</span>
                <span class="px-2 py-0.5 rounded bg-purple-100 text-purple-800">Processing</span>
              </div>
            </div>

            <!-- Final Failure Path Lifecycle -->
            <div class="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2">
              <div class="text-xs font-bold text-slate-800">3. Final Failure Path (FUTURE: DLQ)</div>
              <div class="flex items-center gap-2 font-mono text-xs">
                <span class="px-2 py-0.5 rounded bg-rose-100 text-rose-800">Failed</span>
                <span>➔</span>
                <span class="px-2 py-0.5 rounded bg-rose-200 text-rose-900 font-bold">Max Retries</span>
                <span>➔</span>
                <span class="px-2.5 py-0.5 rounded bg-slate-900 text-rose-300 font-bold">Final Failure</span>
              </div>
            </div>
          </div>

          <!-- Explanation Grid Column -->
          <div class="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div class="p-4 bg-white border border-slate-200/80 rounded-xl space-y-1.5">
              <div class="text-xs font-bold text-slate-900">Controlled Retry Handling</div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Configurable retry limits with exponential backoff and random jitter prevent retry storms.
              </p>
            </div>

            <div class="p-4 bg-white border border-slate-200/80 rounded-xl space-y-1.5">
              <div class="text-xs font-bold text-slate-900">Failure Isolation</div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Panic recovery wrappers isolate worker failures so single corrupted jobs never crash worker nodes.
              </p>
            </div>

            <div class="p-4 bg-white border border-slate-200/80 rounded-xl space-y-1.5">
              <div class="text-xs font-bold text-slate-900">Idempotent Processing</div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Unique execution tokens and state locks prevent double execution during network retries.
              </p>
            </div>

            <div class="p-4 bg-white border border-slate-200/80 rounded-xl space-y-1.5">
              <div class="text-xs font-bold text-slate-900">Worker Concurrency Control</div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Goroutines manage job processing asynchronously, allowing efficient local concurrency without blocking.
              </p>
            </div>

            <div class="p-4 bg-white border border-slate-200/80 rounded-xl space-y-1.5">
              <div class="text-xs font-bold text-slate-900">Backpressure Throttling</div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Dynamic concurrency limits prevent downstream Redis or PostgreSQL queue saturation.
              </p>
            </div>

            <div class="p-4 bg-white border border-slate-200/80 rounded-xl space-y-1.5">
              <div class="text-xs font-bold text-slate-900">Graceful Shutdown</div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Workers handle SIGTERM signals cleanly, completing active jobs before process exit.
              </p>
            </div>

          </div>

        </div>
      </section>

      <!-- ========================================== -->
      <!-- SECTION 6 — SCALING                        -->
      <!-- ========================================== -->
      <section id="scaling" class="py-16 bg-white border-y border-slate-200/80">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="text-center max-w-3xl mx-auto space-y-3 mb-16">
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
          </div>

          <!-- Low vs High Workload Comparison -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div class="p-5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <div class="text-xs font-mono font-bold text-slate-500 uppercase">Baseline Traffic</div>
                <div class="text-sm font-bold text-slate-900">3 Worker Instances</div>
                <div class="text-xs text-slate-500">Low CPU / Memory footprint</div>
              </div>
              <span class="px-2.5 py-1 bg-blue-100 text-blue-700 rounded text-xs font-mono font-bold">Standard</span>
            </div>

            <div class="p-5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <div class="text-xs font-mono font-bold text-slate-500 uppercase">High Workload Burst</div>
                <div class="text-sm font-bold text-slate-900">10+ Worker Instances</div>
                <div class="text-xs text-slate-500">Auto-scales based on Redis queue depth</div>
              </div>
              <span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-mono font-bold">Auto-Scaled</span>
            </div>
          </div>

        </div>
      </section>

      <!-- ========================================== -->
      <!-- SECTION 7 — SYSTEM ARCHITECTURE            -->
      <!-- ========================================== -->
      <section id="architecture" class="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div class="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <h2 class="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600">Infrastructure Blueprint</h2>
          <h3 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Full System Architecture</h3>
        </div>

        <div class="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
          
          <!-- Architecture Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <!-- Component 1: Client & Ingestion -->
            <div class="p-5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div class="text-xs font-mono font-bold text-blue-600 uppercase">1. Ingestion Layer</div>
              <div class="font-bold text-slate-900 text-sm">Angular Client & Gateway</div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Single Page Application dashboard for real-time monitoring and Go REST API handlers for high-throughput payload ingestion.
              </p>
            </div>

            <!-- Component 2: Queue & Storage -->
            <div class="p-5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div class="text-xs font-mono font-bold text-blue-600 uppercase">2. Broker & State Layer</div>
              <div class="font-bold text-slate-900 text-sm">Redis 7 & PostgreSQL 16</div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Redis provides atomic in-memory queue buffering & Pub/Sub event streams. PostgreSQL stores persistent job metadata and execution histories.
              </p>
            </div>

            <!-- Component 3: Worker Engine -->
            <div class="p-5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div class="text-xs font-mono font-bold text-blue-600 uppercase">3. Execution Layer</div>
              <div class="font-bold text-slate-900 text-sm">Go Goroutine Worker Pools</div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Concurrent Go worker processes pull jobs via BRPOP, executing non-blocking background tasks with panic-recovery boundaries.
              </p>
            </div>

          </div>



        </div>
      </section>

      <!-- ========================================== -->
      <!-- SECTION 8 — TECHNOLOGY STACK               -->
      <!-- ========================================== -->
      <section id="technology" class="py-16 bg-white border-y border-slate-200/80">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 class="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600">Technical Foundation</h2>
            <h3 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Technology Stack</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
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

          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- SECTION 9 — WHY THIS ARCHITECTURE?        -->
      <!-- ========================================== -->
      <section class="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div class="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div class="max-w-3xl space-y-6">
            <span class="px-3 py-1 bg-blue-500/20 text-blue-300 font-mono text-xs font-semibold rounded-full border border-blue-500/30">
              Engineering Rationale
            </span>
            
            <h3 class="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Why Asynchronous Job Processing Matters
            </h3>
            
            <p class="text-sm sm:text-base text-slate-300 leading-relaxed">
              "Asynchronous processing keeps user-facing APIs responsive while workers handle expensive operations independently."
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-800">
              <div>
                <h4 class="text-sm font-bold text-blue-400 mb-1">Fast APIs</h4>
                <p class="text-xs text-slate-400 leading-relaxed">
                  Sub-10ms HTTP responses by pushing long-running work off the request handler thread.
                </p>
              </div>

              <div>
                <h4 class="text-sm font-bold text-blue-400 mb-1">Independent Workers</h4>
                <p class="text-xs text-slate-400 leading-relaxed">
                  Compute-heavy tasks run on dedicated worker nodes without consuming web server memory.
                </p>
              </div>

              <div>
                <h4 class="text-sm font-bold text-blue-400 mb-1">Failure Isolation</h4>
                <p class="text-xs text-slate-400 leading-relaxed">
                  Faults in background jobs never impact core user-facing API availability or cause web downtime.
                </p>
              </div>

              <div>
                <h4 class="text-sm font-bold text-blue-400 mb-1">Independent Scaling</h4>
                <p class="text-xs text-slate-400 leading-relaxed">
                  Scale worker capacity dynamically based on queue depth without over-provisioning API gateways.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- SECTION 10 — FINAL CTA                     -->
      <!-- ========================================== -->
      <section class="py-16 bg-white border-t border-slate-200/80">
        <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            See the System in Action
          </h2>
          
          <p class="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Explore the live job queue dashboard and inspect jobs, workers, queues and processing metrics.
          </p>

          <div class="pt-2 flex justify-center">
            <a routerLink="/dashboard" 
               class="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              <span>Go to Dashboard</span>
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- FOOTER                                     -->
      <!-- ========================================== -->
      <footer class="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div class="flex items-center gap-3">
            <div>
              <div class="font-bold text-white text-sm">JobQueue</div>
              <div class="text-[11px] text-slate-500">Distributed background job processing built with Go.</div>
            </div>
          </div>

          <div class="flex items-center gap-6 font-mono">
            <a routerLink="/dashboard" class="hover:text-white transition-colors">Dashboard</a>
            <button (click)="scrollToSection('architecture')" class="hover:text-white transition-colors cursor-pointer">Architecture</button>
            <a href="https://github.com/KrrishSR4/Distributed-job-queue" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors flex items-center gap-1">
              <span>GitHub</span>
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>

        </div>
      </footer>

      <!-- ========================================== -->
      <!-- SCROLL TO TOP PROGRESS BUTTON              -->
      <!-- ========================================== -->
      <button 
        (click)="scrollToSection('top')"
        [class.opacity-0]="!showScrollToTop"
        [class.translate-y-4]="!showScrollToTop"
        [class.pointer-events-none]="!showScrollToTop"
        class="fixed bottom-6 right-6 z-50 p-2 bg-white rounded-full shadow-lg border border-slate-200 transition-all duration-500 hover:shadow-2xl hover:scale-105 group opacity-100 translate-y-0 cursor-pointer flex items-center justify-center">
        
        <div class="relative flex items-center justify-center w-10 h-10">
          <!-- Background Circle -->
          <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              class="text-slate-100"
              stroke-width="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <!-- Progress Circle -->
            <path
              class="text-slate-900 transition-all duration-300 ease-out"
              stroke-dasharray="100, 100"
              [attr.stroke-dashoffset]="100 - scrollProgress"
              stroke-width="3"
              stroke-linecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <!-- Arrow Icon -->
          <svg class="w-4 h-4 text-slate-900 relative z-10 transition-transform duration-300 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </div>
      </button>

    </div>
  `,
})
export class LandingPageComponent {
  showScrollToTop = false;
  scrollProgress = 0;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      this.scrollProgress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      this.showScrollToTop = scrollY > 300;
    }
  }

  scrollToSection(id) {
    if (typeof document !== 'undefined') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
