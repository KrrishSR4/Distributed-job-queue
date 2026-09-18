
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SvgViewerComponent } from '../../shared/components/svg-viewer/svg-viewer.component.js';

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [CommonModule, RouterModule, SvgViewerComponent],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white pb-24 relative">
      <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a routerLink="/" class="flex items-center gap-2 group">
            <span class="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">JobQueue <span class="text-slate-400 font-normal">Docs</span></span>
          </a>
          <nav class="flex items-center gap-6 text-sm font-medium">
            <a routerLink="/dashboard" class="text-slate-600 hover:text-blue-600 transition-colors">Dashboard</a>
            <a href="https://github.com/KrrishSR4/Distributed-job-queue" target="_blank" rel="noopener noreferrer" class="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1">GitHub</a>
          </nav>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col md:flex-row gap-8 relative">
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

        <div class="md:hidden w-full bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-sm">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Contents</div>
          <select (change)="scrollTo($event.target.value)" class="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
            <option *ngFor="let section of sections" [value]="section.id" [selected]="activeSection === section.id">{{ section.title }}</option>
          </select>
        </div>

        <main class="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-12 min-w-0">
          <div class="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-100 prose-h3:text-xl prose-a:text-blue-600 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-slate-900 prose-pre:text-slate-50 prose-pre:rounded-xl">

            <section id="overview" class="scroll-mt-24 mb-16">
              <h1>Distributed Job Queue</h1>
              <p class="lead text-lg text-slate-600">A distributed, asynchronous job processing system designed to demonstrate Go backend engineering, Redis-based queue mechanics, PostgreSQL persistence, and robust worker pool architecture.</p>
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

            <section id="high-level-architecture" class="scroll-mt-24 mb-16">
              <h2>High-Level Architecture</h2>
              <p>The system separates the synchronous API request lifecycle from the asynchronous background processing layer, connected by a high-throughput Redis buffer.</p>
              
              <app-svg-viewer>
                <svg viewBox="0 0 800 500" class="w-full max-w-[800px] text-xs font-mono drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                    </marker>
                  </defs>
                  
  
  <g transform="translate(40, 215)">
    <circle cx="35" cy="35" r="35" class="fill-slate-100 stroke-slate-400" stroke-width="2"/>
    <text x="35" y="39" text-anchor="middle" class="font-bold text-slate-800">User</text>
  </g>

  
  <g transform="translate(160, 220)">
    <rect width="120" height="60" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="34" text-anchor="middle" class="font-bold text-slate-800">Angular App</text>
  </g>

  
  <g transform="translate(360, 220)">
    <rect width="120" height="60" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="34" text-anchor="middle" class="font-bold text-slate-800">Go API Gateway</text>
  </g>

  
  <rect x="540" y="80" width="180" height="150" rx="12" class="fill-transparent stroke-slate-300" stroke-width="2" stroke-dasharray="5,5"/>
  <text x="630" y="105" text-anchor="middle" class="font-bold fill-slate-400">Backend Core</text>
  
  <g transform="translate(570, 120)">
    <rect width="120" height="40" rx="20" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="24" text-anchor="middle" class="font-bold text-slate-800">PostgreSQL</text>
  </g>

  
  <g transform="translate(570, 170)">
    <rect width="120" height="40" rx="20" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="24" text-anchor="middle" class="font-bold text-slate-800">Redis Queue</text>
  </g>

  
  <rect x="540" y="260" width="180" height="200" rx="12" class="fill-transparent stroke-slate-300" stroke-width="2" stroke-dasharray="5,5"/>
  <text x="630" y="285" text-anchor="middle" class="font-bold fill-slate-400">Execution Layer</text>
  
  <g transform="translate(570, 300)">
    <rect width="120" height="40" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="24" text-anchor="middle" class="font-bold text-slate-800">Worker Pool</text>
  </g>

  
  <g transform="translate(580, 360)">
    <rect width="100" height="24" rx="4" class="fill-slate-100 stroke-slate-300 " stroke-width="2" />
    <text x="50" y="16" text-anchor="middle" class="font-bold text-slate-600">Worker 1</text>
  </g>

  
  <g transform="translate(580, 395)">
    <rect width="100" height="24" rx="4" class="fill-slate-100 stroke-slate-300 " stroke-width="2" />
    <text x="50" y="16" text-anchor="middle" class="font-bold text-slate-600">Worker 2</text>
  </g>

  
  <g transform="translate(580, 430)">
    <rect width="100" height="24" rx="4" class="fill-slate-100 stroke-slate-300 " stroke-width="2" />
    <text x="50" y="16" text-anchor="middle" class="font-bold text-slate-600">Worker 3</text>
  </g>


  <path d="M 110 250 L 155 250" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="132.5" y="242" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">HTTP</text>
  <path d="M 280 250 L 355 250" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="317.5" y="242" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">POST /jobs</text>
  <path d="M 480 240 L 510 240 L 510 140 L 565 140" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="500" y="130" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">SQL Insert</text>
  <path d="M 480 260 L 510 260 L 510 190 L 565 190" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="520" y="205" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">LPUSH</text>
  <path d="M 630 210 L 630 295" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="630" y="244.5" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">BRPOP</text>
  <path d="M 570 372 L 520 372 L 520 140 L 565 140" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="480" y="260" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">Update Status</text>

                </svg>
              </app-svg-viewer>
            </section>

            <section id="request-job-flow" class="scroll-mt-24 mb-16">
              <h2>Request / Job Flow</h2>
              <p>When a client submits a job, the Go API validates it, stores the initial metadata in PostgreSQL, and pushes the ID to Redis. This returns a fast <code>201 Created</code> response while workers pick up the heavy lifting concurrently.</p>
              
              <app-svg-viewer>
                <svg viewBox="0 0 800 500" class="w-full max-w-[800px] text-xs font-mono drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                    </marker>
                  </defs>
                  
  <!-- Sequence Diagram style -->
  <g class="stroke-slate-300" stroke-width="2" stroke-dasharray="5,5">
    <line x1="100" y1="50" x2="100" y2="450"/>
    <line x1="220" y1="50" x2="220" y2="450"/>
    <line x1="340" y1="50" x2="340" y2="450"/>
    <line x1="460" y1="50" x2="460" y2="450"/>
    <line x1="580" y1="50" x2="580" y2="450"/>
    <line x1="700" y1="50" x2="700" y2="450"/>
  </g>
  
  <g transform="translate(50, 20)">
    <rect width="100" height="40" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="50" y="24" text-anchor="middle" class="font-bold text-slate-800">Client</text>
  </g>

  
  <g transform="translate(170, 20)">
    <rect width="100" height="40" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="50" y="24" text-anchor="middle" class="font-bold text-slate-800">Go API</text>
  </g>

  
  <g transform="translate(290, 20)">
    <rect width="100" height="40" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="50" y="24" text-anchor="middle" class="font-bold text-slate-800">Service</text>
  </g>

  
  <g transform="translate(410, 20)">
    <rect width="100" height="40" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="50" y="24" text-anchor="middle" class="font-bold text-slate-800">PostgreSQL</text>
  </g>

  
  <g transform="translate(530, 20)">
    <rect width="100" height="40" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="50" y="24" text-anchor="middle" class="font-bold text-slate-800">Redis</text>
  </g>

  
  <g transform="translate(650, 20)">
    <rect width="100" height="40" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="50" y="24" text-anchor="middle" class="font-bold text-slate-800">Worker</text>
  </g>

  
  <path d="M 100 100 L 215 100" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="157.5" y="92" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">POST /jobs</text>
  <path d="M 220 130 L 335 130" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="277.5" y="122" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">CreateJob()</text>
  <path d="M 340 160 L 455 160" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="397.5" y="152" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">INSERT (queued)</text>
  <path d="M 460 190 L 345 190" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="402.5" y="182" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">returns jobID</text>
  <path d="M 340 220 L 575 220" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="457.5" y="212" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">LPUSH &#123;jobID&#125;</text>
  <path d="M 340 250 L 225 250" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="282.5" y="242" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">Job Created</text>
  <path d="M 220 280 L 105 280" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="162.5" y="272" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">201 Created</text>
  
  <rect x="500" y="290" width="220" height="30" class="fill-amber-50 stroke-amber-200" rx="4"/>
  <text x="610" y="310" text-anchor="middle" class="font-bold fill-amber-700 text-[10px]">Asynchronous Processing</text>
  
  <path d="M 700 340 L 585 340" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="642.5" y="332" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">BRPOP</text>
  <path d="M 580 370 L 695 370" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="637.5" y="362" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">&#123;jobID&#125;</text>
  <path d="M 700 400 L 465 400" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="582.5" y="392" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">UPDATE (processing)</text>
  <path d="M 700 440 L 465 440" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="582.5" y="432" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">UPDATE (completed)</text>

                </svg>
              </app-svg-viewer>
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

            <section id="backend-architecture" class="scroll-mt-24 mb-16">
              <h2>Backend Architecture</h2>
              <p>The Go backend follows a strict layered architecture pattern ensuring separation of concerns.</p>
              
              <app-svg-viewer>
                <svg viewBox="0 0 800 500" class="w-full max-w-[800px] text-xs font-mono drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                    </marker>
                  </defs>
                  
  
  <g transform="translate(340, 40)">
    <rect width="120" height="40" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="24" text-anchor="middle" class="font-bold text-slate-800">HTTP Request</text>
  </g>

  <path d="M 400 80 L 400 115" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  
  <g transform="translate(340, 120)">
    <rect width="120" height="40" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="24" text-anchor="middle" class="font-bold text-slate-800">Router (Chi)</text>
  </g>

  <path d="M 400 160 L 400 195" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  
  <g transform="translate(340, 200)">
    <rect width="120" height="40" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="24" text-anchor="middle" class="font-bold text-slate-800">Middleware</text>
  </g>

  <path d="M 400 240 L 400 275" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  
  <rect x="300" y="265" width="200" height="70" rx="8" class="fill-transparent stroke-slate-300" stroke-dasharray="5,5" stroke-width="2"/>
  <text x="320" y="280" class="fill-slate-400 text-[10px] font-bold">API Layer</text>
  
  <g transform="translate(340, 280)">
    <rect width="120" height="40" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="24" text-anchor="middle" class="font-bold text-slate-800">Handler Layer</text>
  </g>

  <path d="M 400 320 L 400 355" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  
  <rect x="300" y="345" width="200" height="70" rx="8" class="fill-transparent stroke-slate-300" stroke-dasharray="5,5" stroke-width="2"/>
  <text x="320" y="360" class="fill-slate-400 text-[10px] font-bold">Business Logic</text>
  
  <g transform="translate(340, 360)">
    <rect width="120" height="40" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="24" text-anchor="middle" class="font-bold text-slate-800">Service Layer</text>
  </g>

  <path d="M 400 400 L 400 435" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  
  <rect x="150" y="425" width="500" height="70" rx="8" class="fill-transparent stroke-slate-300" stroke-dasharray="5,5" stroke-width="2"/>
  <text x="170" y="440" class="fill-slate-400 text-[10px] font-bold">Data Access</text>
  
  <g transform="translate(340, 440)">
    <rect width="120" height="40" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="24" text-anchor="middle" class="font-bold text-slate-800">Repository Layer</text>
  </g>

  
  <path d="M 340 460 L 260 460 L 260 495" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  <path d="M 460 460 L 540 460 L 540 495" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  
  
  <g transform="translate(200, 500)">
    <rect width="120" height="40" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="24" text-anchor="middle" class="font-bold text-slate-800">PostgreSQL</text>
  </g>

  
  <g transform="translate(480, 500)">
    <rect width="120" height="40" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="24" text-anchor="middle" class="font-bold text-slate-800">Redis</text>
  </g>


                </svg>
              </app-svg-viewer>
              <ul>
                <li><strong>Router (Chi)</strong>: Maps HTTP endpoints to specific handler functions.</li>
                <li><strong>Middleware</strong>: Injects context, logging, and CORS handling.</li>
                <li><strong>Handler</strong>: Parses JSON requests, validates input, and formats HTTP responses.</li>
                <li><strong>Service</strong>: Orchestrates business logic, calling databases and caches.</li>
                <li><strong>Repository</strong>: Abstracts raw SQL queries and Redis commands.</li>
              </ul>
            </section>

            <section id="redis-job-queue" class="scroll-mt-24 mb-16">
              <h2>Redis Job Queue</h2>
              <p>Redis acts as a high-speed, volatile message transport mechanism. The <code>jobs:queue</code> is implemented as a Redis List, providing FIFO (First-In-First-Out) queueing.</p>
              
              <app-svg-viewer>
                <svg viewBox="0 0 800 500" class="w-full max-w-[800px] text-xs font-mono drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                    </marker>
                  </defs>
                  
  
  <g transform="translate(100, 200)">
    <rect width="120" height="60" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="34" text-anchor="middle" class="font-bold text-slate-800">Go API</text>
  </g>

  
  <g transform="translate(340, 200)">
    <rect width="120" height="60" rx="20" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="34" text-anchor="middle" class="font-bold text-slate-800">jobs:queue</text>
  </g>

  
  <path d="M 220 230 L 335 230" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="277.5" y="222" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">LPUSH</text>
  
  <path d="M 460 230 L 575 150" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="517.5" y="182" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">BRPOP</text>
  <path d="M 460 230 L 575 230" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="517.5" y="222" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">BRPOP</text>
  <path d="M 460 230 L 575 310" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="517.5" y="262" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">BRPOP</text>
  
  
  <g transform="translate(580, 120)">
    <rect width="120" height="60" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="34" text-anchor="middle" class="font-bold text-slate-800">Worker 1</text>
  </g>

  
  <g transform="translate(580, 200)">
    <rect width="120" height="60" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="34" text-anchor="middle" class="font-bold text-slate-800">Worker 2</text>
  </g>

  
  <g transform="translate(580, 280)">
    <rect width="120" height="60" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="34" text-anchor="middle" class="font-bold text-slate-800">Worker 3</text>
  </g>


                </svg>
              </app-svg-viewer>
              <p>Workers use the blocking <code>BRPOP</code> command, which waits efficiently for new items without polling, resulting in instant job processing and minimal CPU usage.</p>
            </section>

            <section id="worker-pool" class="scroll-mt-24 mb-16">
              <h2>Worker Pool Architecture</h2>
              <p>The system spins up concurrent Goroutines (workers) during application startup. The number of workers is configurable.</p>
              
              <app-svg-viewer>
                <svg viewBox="0 0 800 500" class="w-full max-w-[800px] text-xs font-mono drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                    </marker>
                  </defs>
                  
  
  <g transform="translate(340, 40)">
    <rect width="120" height="60" rx="20" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="34" text-anchor="middle" class="font-bold text-slate-800">Redis Queue</text>
  </g>

  <path d="M 400 100 L 400 155" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  
  <g transform="translate(340, 160)">
    <rect width="120" height="60" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="34" text-anchor="middle" class="font-bold text-slate-800">Worker Manager</text>
  </g>

  
  <rect x="150" y="270" width="500" height="120" rx="8" class="fill-transparent stroke-slate-300" stroke-dasharray="5,5" stroke-width="2"/>
  <text x="170" y="290" class="fill-slate-400 text-[10px] font-bold">WaitGroup</text>
  
  
  <g transform="translate(180, 290)">
    <circle cx="40" cy="40" r="40" class="fill-slate-100 stroke-slate-400" stroke-width="2"/>
    <text x="40" y="44" text-anchor="middle" class="font-bold text-slate-800">G1</text>
  </g>

  
  <g transform="translate(360, 290)">
    <circle cx="40" cy="40" r="40" class="fill-slate-100 stroke-slate-400" stroke-width="2"/>
    <text x="40" y="44" text-anchor="middle" class="font-bold text-slate-800">G2</text>
  </g>

  
  <g transform="translate(540, 290)">
    <circle cx="40" cy="40" r="40" class="fill-slate-100 stroke-slate-400" stroke-width="2"/>
    <text x="40" y="44" text-anchor="middle" class="font-bold text-slate-800">GN</text>
  </g>

  
  <path d="M 360 220 L 220 285" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="290" y="240" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">Job</text>
  <path d="M 400 220 L 400 285" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="420" y="250" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">Job</text>
  <path d="M 440 220 L 580 285" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="510" y="240" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">Job</text>
  
  <path d="M 220 370 L 360 435" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  <path d="M 400 370 L 400 435" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  <path d="M 580 370 L 440 435" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  
  
  <g transform="translate(340, 440)">
    <rect width="120" height="60" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="34" text-anchor="middle" class="font-bold text-slate-800">PostgreSQL</text>
  </g>


                </svg>
              </app-svg-viewer>
              <p>Each worker independently fetches from Redis. A global <code>sync.WaitGroup</code> ensures graceful shutdown, allowing workers to finish their current job before the server exits when a SIGINT/SIGTERM is received.</p>
            </section>

            <section id="job-lifecycle" class="scroll-mt-24 mb-16">
              <h2>Job Lifecycle</h2>
              <p>A job transitions through distinct states managed by the worker and stored in PostgreSQL.</p>
              
              <app-svg-viewer>
                <svg viewBox="0 0 800 500" class="w-full max-w-[800px] text-xs font-mono drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                    </marker>
                  </defs>
                  
  
  <g transform="translate(380, 40)">
    <circle cx="15" cy="15" r="15" class="fill-slate-100 stroke-slate-400" stroke-width="2"/>
    <text x="15" y="19" text-anchor="middle" class="font-bold text-slate-800"> </text>
  </g>

  <circle cx="395" cy="55" r="10" class="fill-slate-800"/>
  <path d="M 395 70 L 395 115" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="395" y="84.5" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">Create</text>
  
  
  <g transform="translate(335, 120)">
    <rect width="120" height="50" rx="25" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="29" text-anchor="middle" class="font-bold text-slate-800">queued</text>
  </g>

  <path d="M 395 170 L 395 235" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="395" y="194.5" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">Picked up</text>
  
  
  <g transform="translate(335, 240)">
    <rect width="120" height="50" rx="25" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="29" text-anchor="middle" class="font-bold text-slate-800">processing</text>
  </g>

  
  <path d="M 335 265 L 200 265 L 200 315" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="260" y="255" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">Success</text>
  <path d="M 455 265 L 590 265 L 590 315" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="530" y="255" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">Max attempts</text>
  <path d="M 395 290 L 395 365" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="440" y="320" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">Fail (retry)</text>
  
  
  <g transform="translate(140, 320)">
    <rect width="120" height="50" rx="25" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="29" text-anchor="middle" class="font-bold text-slate-800">completed</text>
  </g>

  
  <g transform="translate(530, 320)">
    <rect width="120" height="50" rx="25" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="29" text-anchor="middle" class="font-bold text-slate-800">failed</text>
  </g>

  
  <g transform="translate(335, 370)">
    <rect width="120" height="50" rx="25" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="29" text-anchor="middle" class="font-bold text-slate-800">retry</text>
  </g>

  
  <path d="M 335 395 L 280 395 L 280 145 L 330 145" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="230" y="270" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">Backoff exp.</text>
  
  <circle cx="200" cy="420" r="15" class="fill-transparent stroke-slate-800" stroke-width="2"/>
  <circle cx="200" cy="420" r="10" class="fill-slate-800"/>
  <path d="M 200 370 L 200 400" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  
  <circle cx="590" cy="420" r="15" class="fill-transparent stroke-slate-800" stroke-width="2"/>
  <circle cx="590" cy="420" r="10" class="fill-slate-800"/>
  <path d="M 590 370 L 590 400" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>

                </svg>
              </app-svg-viewer>
            </section>

            <section id="retry-mechanism" class="scroll-mt-24 mb-16">
              <h2>Retry Mechanism & Backoff</h2>
              <p>Jobs that fail due to transient errors (like external API timeouts) are automatically retried using an exponential backoff strategy.</p>
              
              <app-svg-viewer>
                <svg viewBox="0 0 800 500" class="w-full max-w-[800px] text-xs font-mono drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                    </marker>
                  </defs>
                  
  
  <g transform="translate(340, 40)">
    <rect width="120" height="50" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="29" text-anchor="middle" class="font-bold text-slate-800">Processing</text>
  </g>

  <path d="M 400 90 L 400 125" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  
  <polygon points="400,130 460,160 400,190 340,160" class="fill-slate-100 stroke-slate-400" stroke-width="2"/>
  <text x="400" y="164" text-anchor="middle" class="font-bold fill-slate-800">Fails?</text>
  
  <path d="M 400 190 L 400 235" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="415" y="210" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">Yes</text>
  
  <polygon points="400,240 480,270 400,300 320,270" class="fill-slate-100 stroke-slate-400" stroke-width="2"/>
  <text x="400" y="274" text-anchor="middle" class="font-bold fill-slate-800">Attempts < Max?</text>
  
  <path d="M 400 300 L 400 345" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="415" y="320" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">Yes</text>
  <path d="M 480 270 L 590 270 L 590 345" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="540" y="260" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">No</text>
  
  
  <g transform="translate(290, 350)">
    <rect width="220" height="50" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="110" y="29" text-anchor="middle" class="font-bold text-slate-800">Delay = base * 2^attempt</text>
  </g>

  
  <g transform="translate(530, 350)">
    <rect width="120" height="50" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="29" text-anchor="middle" class="font-bold text-slate-800">Mark Failed</text>
  </g>

  
  <path d="M 400 400 L 400 445" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  
  <g transform="translate(340, 450)">
    <rect width="120" height="50" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="29" text-anchor="middle" class="font-bold text-slate-800">Wait Delay</text>
  </g>

  
  <path d="M 340 475 L 200 475 L 200 65 L 335 65" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="180" y="270" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">LPUSH (Requeue)</text>

                </svg>
              </app-svg-viewer>
              <p>The delay is calculated using: <code>delay = base_delay × 2^(attempt - 1)</code>. This prevents retry storms that could overwhelm recovering downstream services.</p>
            </section>

            <section id="database-design" class="scroll-mt-24 mb-16">
              <h2>Database Design</h2>
              <p>The PostgreSQL schema uses <code>UUID</code> primary keys and stores unstructured data in a <code>JSONB</code> payload column. Indexes optimize common query patterns.</p>
              
              <app-svg-viewer>
                <svg viewBox="0 0 800 500" class="w-full max-w-[800px] text-xs font-mono drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                    </marker>
                  </defs>
                  
  <rect x="250" y="40" width="300" height="420" rx="8" class="fill-white stroke-slate-300" stroke-width="2"/>
  <rect x="250" y="40" width="300" height="40" rx="8" class="fill-slate-100 stroke-slate-300" stroke-width="2"/>
  <text x="400" y="65" text-anchor="middle" class="font-bold fill-slate-800 text-lg">JOBS</text>
  
  <g class="font-mono text-sm fill-slate-700">
    <text x="270" y="105"><tspan class="font-bold">id</tspan> (UUID) PK</text>
    <text x="270" y="130">type (VARCHAR)</text>
    <text x="270" y="155">payload (JSONB)</text>
    <text x="270" y="180">priority (VARCHAR)</text>
    <text x="270" y="205">status (VARCHAR)</text>
    <text x="270" y="230">attempts (INT)</text>
    <text x="270" y="255">max_attempts (INT)</text>
    <text x="270" y="280">scheduled_at (TIMESTAMPTZ)</text>
    <text x="270" y="305">created_at (TIMESTAMPTZ)</text>
    <text x="270" y="330">started_at (TIMESTAMPTZ)</text>
    <text x="270" y="355">completed_at (TIMESTAMPTZ)</text>
    <text x="270" y="380">failed_at (TIMESTAMPTZ)</text>
    <text x="270" y="405">error (TEXT)</text>
    <text x="270" y="430">worker_id (VARCHAR)</text>
  </g>

                </svg>
              </app-svg-viewer>
            </section>

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
                    <pre class="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto"><code>&#123;
  "type": "email_notification",
  "payload": &#123;
    "user_id": 123,
    "template": "welcome"
  &#125;
&#125;</code></pre>
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

            <section id="health-dependencies" class="scroll-mt-24 mb-16">
              <h2>Health & Dependencies</h2>
              <p>The <code>/health</code> endpoint validates the state of the API and its connection to critical downstream infrastructure.</p>
              
              <app-svg-viewer>
                <svg viewBox="0 0 800 500" class="w-full max-w-[800px] text-xs font-mono drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                    </marker>
                  </defs>
                  
  
  <g transform="translate(50, 200)">
    <rect width="120" height="50" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="29" text-anchor="middle" class="font-bold text-slate-800">Health API</text>
  </g>

  <path d="M 170 225 L 275 225" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="222.5" y="217" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">GET /health</text>
  
  <g transform="translate(280, 200)">
    <rect width="120" height="50" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="29" text-anchor="middle" class="font-bold text-slate-800">Go API Status</text>
  </g>

  
  <path d="M 400 215 L 480 150" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="430" y="170" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">Ping</text>
  <path d="M 400 235 L 480 300" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="430" y="280" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">Ping</text>
  
  
  <g transform="translate(490, 120)">
    <rect width="120" height="50" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="29" text-anchor="middle" class="font-bold text-slate-800">PostgreSQL</text>
  </g>

  
  <g transform="translate(490, 280)">
    <rect width="120" height="50" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="29" text-anchor="middle" class="font-bold text-slate-800">Redis</text>
  </g>


                </svg>
              </app-svg-viewer>
            </section>

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

            <section id="devops-architecture" class="scroll-mt-24 mb-16">
              <h2>DevOps Architecture (Planned)</h2>
              <p>The intended deployment pipeline heavily utilizes CI/CD automation via GitHub Actions to deploy immutable containers.</p>
              
              <app-svg-viewer>
                <svg viewBox="0 0 800 500" class="w-full max-w-[800px] text-xs font-mono drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                    </marker>
                  </defs>
                  
  
  <g transform="translate(40, 200)">
    <rect width="100" height="50" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="50" y="29" text-anchor="middle" class="font-bold text-slate-800">Developer</text>
  </g>

  <path d="M 140 225 L 195 225" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="167.5" y="217" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">Push</text>
  
  <g transform="translate(200, 200)">
    <rect width="100" height="50" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="50" y="29" text-anchor="middle" class="font-bold text-slate-800">GitHub</text>
  </g>

  <path d="M 300 225 L 355 225" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="327.5" y="217" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">Trigger</text>
  
  <g transform="translate(360, 200)">
    <rect width="100" height="50" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="50" y="29" text-anchor="middle" class="font-bold text-slate-800">Actions</text>
  </g>

  <path d="M 460 225 L 515 225" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="487.5" y="217" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">Build</text>
  
  <g transform="translate(520, 200)">
    <rect width="100" height="50" rx="8" class="fill-amber-50 stroke-amber-500 stroke-dashed" stroke-width="2" stroke-dasharray="5,5"/>
    <text x="50" y="29" text-anchor="middle" class="font-bold text-amber-800">Registry</text>
  </g>

  <path d="M 620 225 L 675 225" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="647.5" y="217" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">Deploy</text>
  
  <g transform="translate(680, 200)">
    <rect width="100" height="50" rx="8" class="fill-amber-50 stroke-amber-500 stroke-dashed" stroke-width="2" stroke-dasharray="5,5"/>
    <text x="50" y="29" text-anchor="middle" class="font-bold text-amber-800">Kubernetes</text>
  </g>


                </svg>
              </app-svg-viewer>
            </section>

            <section id="kubernetes-architecture" class="scroll-mt-24 mb-16">
              <h2>Kubernetes Architecture (Planned)</h2>
              <p>The production deployment will utilize Kubernetes for orchestration, segregating the stateless API and stateful dependencies.</p>
              
              <app-svg-viewer>
                <svg viewBox="0 0 800 500" class="w-full max-w-[800px] text-xs font-mono drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                    </marker>
                  </defs>
                  
  
  <g transform="translate(340, 40)">
    <rect width="120" height="50" rx="8" class="fill-amber-50 stroke-amber-500 stroke-dashed" stroke-width="2" stroke-dasharray="5,5"/>
    <text x="60" y="29" text-anchor="middle" class="font-bold text-amber-800">Ingress Controller</text>
  </g>

  <path d="M 400 90 L 400 135" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  
  <g transform="translate(340, 140)">
    <rect width="120" height="50" rx="8" class="fill-amber-50 stroke-amber-500 stroke-dashed" stroke-width="2" stroke-dasharray="5,5"/>
    <text x="60" y="29" text-anchor="middle" class="font-bold text-amber-800">API Service</text>
  </g>

  
  <path d="M 380 190 L 320 245" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  <path d="M 420 190 L 480 245" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  
  
  <g transform="translate(280, 250)">
    <circle cx="40" cy="40" r="40" class="fill-amber-50 stroke-amber-500" stroke-width="2"/>
    <text x="40" y="44" text-anchor="middle" class="font-bold text-amber-800">API Pod</text>
  </g>

  
  <g transform="translate(440, 250)">
    <circle cx="40" cy="40" r="40" class="fill-amber-50 stroke-amber-500" stroke-width="2"/>
    <text x="40" y="44" text-anchor="middle" class="font-bold text-amber-800">API Pod</text>
  </g>

  
  
  <g transform="translate(120, 250)">
    <circle cx="40" cy="40" r="40" class="fill-amber-50 stroke-amber-500" stroke-width="2"/>
    <text x="40" y="44" text-anchor="middle" class="font-bold text-amber-800">Worker</text>
  </g>

  
  <g transform="translate(600, 250)">
    <circle cx="40" cy="40" r="40" class="fill-amber-50 stroke-amber-500" stroke-width="2"/>
    <text x="40" y="44" text-anchor="middle" class="font-bold text-amber-800">Worker</text>
  </g>

  
  <rect x="250" y="370" width="300" height="100" rx="8" class="fill-transparent stroke-amber-500" stroke-dasharray="5,5" stroke-width="2"/>
  <text x="400" y="390" class="fill-amber-600 text-[10px] font-bold text-anchor-middle">Stateful</text>
  
  
  <g transform="translate(270, 400)">
    <rect width="120" height="50" rx="8" class="fill-amber-50 stroke-amber-500 stroke-dashed" stroke-width="2" stroke-dasharray="5,5"/>
    <text x="60" y="29" text-anchor="middle" class="font-bold text-amber-800">PostgreSQL</text>
  </g>

  
  <g transform="translate(410, 400)">
    <rect width="120" height="50" rx="8" class="fill-amber-50 stroke-amber-500 stroke-dashed" stroke-width="2" stroke-dasharray="5,5"/>
    <text x="60" y="29" text-anchor="middle" class="font-bold text-amber-800">Redis</text>
  </g>

  
  <path d="M 320 330 L 320 395" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  <path d="M 480 330 L 480 395" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  <path d="M 160 330 L 320 395" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  <path d="M 640 330 L 480 395" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>

                </svg>
              </app-svg-viewer>
            </section>

            <section id="observability" class="scroll-mt-24 mb-16">
              <h2>Observability (Planned)</h2>
              <p>A comprehensive observability stack is planned to monitor queue depth, worker throughput, and processing latency using Prometheus and Grafana.</p>
            </section>

            <section id="system-design" class="scroll-mt-24 mb-16">
              <h2>System Design Concepts</h2>
              <h3>Asynchronous Processing</h3>
              <p>By delegating expensive tasks to background workers, the HTTP request loop remains fast.</p>
              <h3>Horizontal Scaling & Worker Pool</h3>
              <p>The system can scale horizontally by adding more worker processes.</p>
              <h3>Retry Storms & Exponential Backoff</h3>
              <p>Exponential backoff ensures retries happen further apart, giving downstream services time to heal.</p>
              <h3>PostgreSQL as Source of Truth</h3>
              <p>While Redis handles volatile queue transport, PostgreSQL ensures durability.</p>
            </section>

            <section id="failure-scenarios" class="scroll-mt-24 mb-16">
              <h2>Failure Scenarios</h2>
              <div class="overflow-x-auto not-prose">
                <table class="w-full text-sm text-left text-slate-600 border-collapse">
                  <thead class="text-xs text-slate-700 uppercase bg-slate-50 border-y border-slate-200">
                    <tr><th class="px-6 py-3">Scenario</th><th class="px-6 py-3">Current Behavior</th></tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200">
                    <tr class="bg-white"><td class="px-6 py-4 font-bold text-slate-900">Redis Down</td><td class="px-6 py-4">API returns 500 when attempting to enqueue. Workers block/panic.</td></tr>
                    <tr class="bg-white"><td class="px-6 py-4 font-bold text-slate-900">PostgreSQL Down</td><td class="px-6 py-4">API fails to create job metadata. System halts processing.</td></tr>
                    <tr class="bg-white"><td class="px-6 py-4 font-bold text-slate-900">Worker Crashes</td><td class="px-6 py-4">Panic recovery middleware traps error, marks job as failed, and re-enqueues if attempts allow.</td></tr>
                    <tr class="bg-white"><td class="px-6 py-4 font-bold text-slate-900">API Gateway Crashes</td><td class="px-6 py-4">New requests fail, but existing jobs continue to process.</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="security" class="scroll-mt-24 mb-16">
              <h2>Security (Planned)</h2>
              <ul>
                <li>Input validation & payload sanitization</li>
                <li>Strict rate limiting on job ingestion</li>
                <li>Least-privilege RBAC for Kubernetes service accounts</li>
                <li>TLS termination at ingress</li>
              </ul>
            </section>

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

            <section id="complete-system-diagram" class="scroll-mt-24">
              <h2>Complete System Architecture</h2>
              <p>This diagram represents the holistic vision of the distributed system, combining the existing application layer with the planned infrastructure and observability stack.</p>
              
              <app-svg-viewer>
                <svg viewBox="0 0 800 500" class="w-full max-w-[800px] text-xs font-mono drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                    </marker>
                  </defs>
                  
  
  <g transform="translate(360, 40)">
    <circle cx="40" cy="40" r="40" class="fill-slate-100 stroke-slate-400" stroke-width="2"/>
    <text x="40" y="44" text-anchor="middle" class="font-bold text-slate-800">User</text>
  </g>

  <path d="M 400 80 L 400 135" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="400" y="99.5" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">HTTP</text>
  
  <g transform="translate(340, 140)">
    <rect width="120" height="50" rx="8" class="fill-amber-50 stroke-amber-500 stroke-dashed" stroke-width="2" stroke-dasharray="5,5"/>
    <text x="60" y="29" text-anchor="middle" class="font-bold text-amber-800">Ingress/Gateway</text>
  </g>

  <path d="M 400 190 L 400 235" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  
  <g transform="translate(340, 240)">
    <rect width="120" height="50" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="60" y="29" text-anchor="middle" class="font-bold text-slate-800">Go REST API</text>
  </g>

  
  <rect x="50" y="320" width="260" height="160" rx="8" class="fill-transparent stroke-slate-300" stroke-dasharray="5,5" stroke-width="2"/>
  <text x="180" y="340" text-anchor="middle" class="font-bold fill-slate-400">Data Layer</text>
  
  <g transform="translate(70, 360)">
    <rect width="100" height="50" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="50" y="29" text-anchor="middle" class="font-bold text-slate-800">PostgreSQL</text>
  </g>

  
  <g transform="translate(190, 360)">
    <rect width="100" height="50" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="50" y="29" text-anchor="middle" class="font-bold text-slate-800">Redis</text>
  </g>

  
  <path d="M 340 290 L 120 355" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="220" y="310" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">SQL</text>
  <path d="M 380 290 L 240 355" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="320" y="320" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">Queue</text>
  
  <rect x="490" y="320" width="260" height="160" rx="8" class="fill-transparent stroke-slate-300" stroke-dasharray="5,5" stroke-width="2"/>
  <text x="620" y="340" text-anchor="middle" class="font-bold fill-slate-400">Worker Nodes</text>
  
  <g transform="translate(510, 360)">
    <rect width="220" height="40" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="110" y="24" text-anchor="middle" class="font-bold text-slate-800">Worker Manager</text>
  </g>

  
  <g transform="translate(510, 420)">
    <rect width="100" height="40" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="50" y="24" text-anchor="middle" class="font-bold text-slate-800">Worker 1</text>
  </g>

  
  <g transform="translate(630, 420)">
    <rect width="100" height="40" rx="8" class="fill-slate-100 stroke-slate-400 " stroke-width="2" />
    <text x="50" y="24" text-anchor="middle" class="font-bold text-slate-800">Worker 2</text>
  </g>

  
  <path d="M 290 385 L 505 385" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="400" y="375" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">Pub/Sub & Lists</text>
  
  <rect x="290" y="520" width="220" height="160" rx="8" class="fill-transparent stroke-amber-500" stroke-dasharray="5,5" stroke-width="2"/>
  <text x="400" y="540" text-anchor="middle" class="font-bold fill-amber-600">Observability</text>
  
  <g transform="translate(310, 550)">
    <rect width="80" height="40" rx="8" class="fill-amber-50 stroke-amber-500 stroke-dashed" stroke-width="2" stroke-dasharray="5,5"/>
    <text x="40" y="24" text-anchor="middle" class="font-bold text-amber-800">Prometheus</text>
  </g>

  
  <g transform="translate(410, 550)">
    <rect width="80" height="40" rx="8" class="fill-amber-50 stroke-amber-500 stroke-dashed" stroke-width="2" stroke-dasharray="5,5"/>
    <text x="40" y="24" text-anchor="middle" class="font-bold text-amber-800">Loki</text>
  </g>

  
  <g transform="translate(360, 620)">
    <rect width="80" height="40" rx="8" class="fill-amber-50 stroke-amber-500 stroke-dashed" stroke-width="2" stroke-dasharray="5,5"/>
    <text x="40" y="24" text-anchor="middle" class="font-bold text-amber-800">Grafana</text>
  </g>

  
  <path d="M 420 290 L 350 545" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="395" y="420" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">Metrics</text>
  <path d="M 560 460 L 450 545" class="stroke-slate-400" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
<text x="510" y="510" text-anchor="middle" class="fill-slate-500 text-[10px] font-semibold">Logs</text>

                </svg>
              </app-svg-viewer>
            </section>

          </div>
        </main>
      </div>
      
      <!-- Scroll to Top with Progress -->
      <button (click)="scrollTo('overview')" 
              [class.opacity-0]="scrollProgress < 5" 
              [class.pointer-events-none]="scrollProgress < 5"
              class="fixed bottom-8 right-8 z-50 group flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg border border-slate-200 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 focus:outline-none">
        
        <!-- Progress Circle (SVG) -->
        <svg class="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" class="fill-none stroke-slate-100" stroke-width="6"></circle>
          <circle cx="50" cy="50" r="46" class="fill-none stroke-blue-500 transition-all duration-300 ease-out" stroke-width="6" stroke-linecap="round" 
                  [style.stroke-dasharray]="289" 
                  [style.stroke-dashoffset]="289 - (289 * scrollProgress / 100)"></circle>
        </svg>
        
        <!-- Arrow Icon -->
        <svg class="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
      
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
  scrollProgress = 0;

  @HostListener('window:scroll', [])
  onScroll() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    this.scrollProgress = windowHeight > 0 ? (scrollPosition / windowHeight) * 100 : 0;
    
    for (let i = this.sections.length - 1; i >= 0; i--) {
      const section = this.sections[i];
      const element = document.getElementById(section.id);
      if (element) {
        if (element.offsetTop - 100 <= scrollPosition) {
          this.activeSection = section.id;
          break;
        }
      }
    }
  }

  scrollTo(id) {
    if (typeof document === 'undefined') return;
    this.activeSection = id;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
