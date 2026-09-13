import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component.js';
import { HeaderComponent } from '../../shared/components/header/header.component.js';
import { ToastComponent } from '../../shared/components/toast/toast.component.js';
import { ModalComponent } from '../../shared/components/modal/modal.component.js';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component.js';
import { JobService } from '../../services/job.service.js';
import { NotificationService } from '../../services/notification.service.js';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    RouterModule, 
    SidebarComponent, 
    HeaderComponent, 
    ToastComponent, 
    ModalComponent, 
    StatusBadgeComponent
  ],
  template: `
    <div class="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      <!-- Sidebar Navigation -->
      <app-sidebar [(collapsed)]="sidebarCollapsed"></app-sidebar>

      <!-- Main Workspace Area -->
      <div class="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        <!-- Header -->
        <app-header [title]="pageTitle" (openEnqueueModal)="isEnqueueModalOpen = true"></app-header>

        <!-- Scrollable Page Content -->
        <main class="flex-1 overflow-y-auto p-6 space-y-6">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Toast Container -->
      <app-toast></app-toast>

      <!-- Enqueue Job Dialog Modal -->
      <app-modal [isOpen]="isEnqueueModalOpen" 
                 (isOpenChange)="isEnqueueModalOpen = $event"
                 title="Enqueue New Background Job" 
                 subtitle="Submit a payload to worker cluster"
                 size="lg">
        <form (ngSubmit)="submitNewJob()" class="space-y-4 font-sans text-xs">
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Type / Task Handler</label>
              <select [(ngModel)]="newJobType" name="newJobType" required
                      class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-mono">
                <option value="ProcessStripeInvoice">ProcessStripeInvoice</option>
                <option value="SendWelcomeEmail">SendWelcomeEmail</option>
                <option value="TranscodeVideoTask">TranscodeVideoTask</option>
                <option value="AggregateMetricsJob">AggregateMetricsJob</option>
                <option value="SyncUserMetadata">SyncUserMetadata</option>
                <option value="GenerateMonthlyReport">GenerateMonthlyReport</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Queue</label>
              <select [(ngModel)]="newJobQueue" name="newJobQueue" required
                      class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-mono">
                <option value="default">default</option>
                <option value="high-priority">high-priority</option>
                <option value="billing-webhooks">billing-webhooks</option>
                <option value="video-encoding">video-encoding</option>
                <option value="email-notifications">email-notifications</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority Tier</label>
              <select [(ngModel)]="newJobPriority" name="newJobPriority"
                      class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-mono">
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Max Retry Limit</label>
              <input type="number" [(ngModel)]="newJobRetryLimit" name="newJobRetryLimit" min="1" max="10"
                     class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-mono">
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Schedule Delay</label>
              <select [(ngModel)]="newJobSchedule" name="newJobSchedule"
                      class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-mono">
                <option value="NOW">Immediate Execution</option>
                <option value="5m">Delay 5 Minutes</option>
                <option value="1h">Delay 1 Hour</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Payload JSON Object</label>
            <textarea [(ngModel)]="newJobPayloadJson" name="newJobPayloadJson" rows="4" required
                      class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs font-mono text-emerald-600 dark:text-emerald-400 focus:outline-none focus:border-blue-500 leading-relaxed"></textarea>
          </div>

          <div footer class="flex items-center gap-2">
            <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors">
              Submit & Enqueue
            </button>
            <button type="button" (click)="isEnqueueModalOpen = false" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      </app-modal>

      <!-- Global Job Details Modal Inspector -->
      <app-modal [isOpen]="!!(jobService.selectedJob$ | async)" 
                 (isOpenChange)="onModalOpenChange($event)"
                 [title]="'Job Details & Lifecycle Inspector'" 
                 [subtitle]="(jobService.selectedJob$ | async)?.id"
                 size="2xl">
        <div *if="(jobService.selectedJob$ | async) as job" class="space-y-5 font-sans">
          
          <!-- Visual Lifecycle Timeline Step Progress -->
          <div class="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span class="text-[10px] uppercase font-mono font-semibold text-slate-400 block mb-3">Job Execution Lifecycle Step</span>
            
            <div class="flex items-center justify-between relative">
              <!-- Horizontal Bar -->
              <div class="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 -z-0"></div>

              <!-- Step 1: Created -->
              <div class="relative z-10 flex flex-col items-center gap-1.5">
                <div class="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">✓</div>
                <span class="text-[11px] font-medium text-slate-700 dark:text-slate-300">Created</span>
              </div>

              <!-- Step 2: Queued -->
              <div class="relative z-10 flex flex-col items-center gap-1.5">
                <div [ngClass]="job.status === 'queued' ? 'bg-blue-600 text-white' : 'bg-emerald-500 text-white'" 
                     class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-xs">
                  {{ job.status === 'queued' ? '2' : '✓' }}
                </div>
                <span class="text-[11px] font-medium text-slate-700 dark:text-slate-300">Queued</span>
              </div>

              <!-- Step 3: Processing -->
              <div class="relative z-10 flex flex-col items-center gap-1.5">
                <div [ngClass]="job.status === 'running' ? 'bg-blue-600 text-white animate-pulse' : (job.status === 'completed' ? 'bg-emerald-500 text-white' : (job.status === 'failed' ? 'bg-rose-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'))" 
                     class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-xs">
                  {{ job.status === 'completed' ? '✓' : (job.status === 'failed' ? '!' : '3') }}
                </div>
                <span class="text-[11px] font-medium text-slate-700 dark:text-slate-300">Processing</span>
              </div>

              <!-- Step 4: Outcome (Completed / Failed) -->
              <div class="relative z-10 flex flex-col items-center gap-1.5">
                <div [ngClass]="job.status === 'completed' ? 'bg-emerald-500 text-white' : (job.status === 'failed' ? 'bg-rose-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500')" 
                     class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-xs">
                  {{ job.status === 'completed' ? '✓' : (job.status === 'failed' ? '✗' : '4') }}
                </div>
                <span class="text-[11px] font-medium capitalize" [ngClass]="job.status === 'failed' ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-700 dark:text-slate-300'">
                  {{ job.status === 'failed' ? 'Failed' : 'Completed' }}
                </span>
              </div>

            </div>
          </div>

          <!-- Metadata Specs Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 text-xs">
            <div>
              <span class="text-[10px] uppercase font-mono text-slate-400 block">Status</span>
              <div class="mt-1">
                <app-status-badge [status]="job.status"></app-status-badge>
              </div>
            </div>
            <div>
              <span class="text-[10px] uppercase font-mono text-slate-400 block">Priority</span>
              <div class="mt-1">
                <app-status-badge [status]="job.priority"></app-status-badge>
              </div>
            </div>
            <div>
              <span class="text-[10px] uppercase font-mono text-slate-400 block">Queue</span>
              <span class="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-1 block truncate">{{ job.queue }}</span>
            </div>
            <div>
              <span class="text-[10px] uppercase font-mono text-slate-400 block">Worker Assigned</span>
              <span class="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-1 block truncate">{{ job.worker }}</span>
            </div>
          </div>

          <!-- Error Details Callout -->
          <div *if="job.error" class="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-lg">
            <span class="text-[10px] uppercase font-mono text-rose-600 dark:text-rose-400 font-bold block mb-1">Execution Failure Reason</span>
            <p class="text-xs font-mono text-rose-800 dark:text-rose-200 leading-relaxed break-words">{{ job.error }}</p>
          </div>

          <!-- Payload JSON -->
          <div>
            <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">Payload Object</span>
            <pre class="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-emerald-600 dark:text-emerald-400 overflow-x-auto max-h-40 leading-relaxed">{{ formatJson(job.payload) }}</pre>
          </div>

          <!-- Logs Timeline -->
          <div>
            <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">Execution Log Stream</span>
            <div class="bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200/80 dark:border-slate-800 p-3 max-h-36 overflow-y-auto space-y-1 font-mono text-xs text-slate-600 dark:text-slate-400">
              <div *for="let log of job.logs" class="hover:bg-slate-200/50 dark:hover:bg-slate-900 px-1 py-0.5 rounded transition-colors">
                {{ log }}
              </div>
            </div>
          </div>

          <!-- Modal Action Buttons -->
          <div footer class="flex items-center gap-2">
            <button (click)="retryJob(job.id)" class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors">
              Retry Job
            </button>
            <button (click)="cancelJob(job.id)" class="px-3.5 py-1.5 bg-rose-50 dark:bg-rose-600/20 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-600/30 text-xs font-semibold rounded-lg transition-colors">
              Cancel Job
            </button>
            <button (click)="jobService.clearSelectedJob()" class="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg transition-colors">
              Close
            </button>
          </div>

        </div>
      </app-modal>

    </div>
  `
})
export class MainLayoutComponent {
  sidebarCollapsed = false;
  pageTitle = 'Dashboard';
  isEnqueueModalOpen = false;

  newJobType = 'ProcessStripeInvoice';
  newJobQueue = 'billing-webhooks';
  newJobPriority = 'high';
  newJobRetryLimit = 3;
  newJobSchedule = 'NOW';
  newJobPayloadJson = JSON.stringify({ invoice_id: 'in_99012', amount_cents: 2990, customer: 'cus_88921' }, null, 2);

  router = inject(Router);
  jobService = inject(JobService);
  notificationService = inject(NotificationService);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.updateTitle(event.urlAfterRedirects);
    });
  }

  updateTitle(url) {
    if (url.includes('/jobs')) this.pageTitle = 'Jobs Explorer';
    else if (url.includes('/workers')) this.pageTitle = 'Worker Nodes';
    else if (url.includes('/queues')) this.pageTitle = 'Queue Management';
    else if (url.includes('/scheduler')) this.pageTitle = 'Cron Scheduler';
    else if (url.includes('/dlq')) this.pageTitle = 'Dead Letter Queue';
    else if (url.includes('/analytics')) this.pageTitle = 'System Analytics';
    else if (url.includes('/settings')) this.pageTitle = 'Settings';
    else this.pageTitle = 'Overview';
  }

  onModalOpenChange(isOpen) {
    if (!isOpen) {
      this.jobService.clearSelectedJob();
    }
  }

  formatJson(obj) {
    return JSON.stringify(obj, null, 2);
  }

  retryJob(id) {
    this.jobService.retryJob(id);
    this.notificationService.success('Job Retried', `Job ${id} re-enqueued.`);
  }

  cancelJob(id) {
    this.jobService.cancelJob(id);
    this.notificationService.warning('Job Cancelled', `Job ${id} marked as cancelled.`);
  }

  submitNewJob() {
    let parsedPayload = {};
    try {
      parsedPayload = JSON.parse(this.newJobPayloadJson);
    } catch (e) {
      this.notificationService.error('Invalid JSON', 'Please enter a valid JSON payload object.');
      return;
    }

    const job = this.jobService.enqueueMockJob(
      this.newJobType,
      this.newJobQueue,
      this.newJobPriority,
      parsedPayload,
      this.newJobRetryLimit
    );

    this.notificationService.success('Job Enqueued Successfully', `Job ${job.id} dispatched to queue [${this.newJobQueue}].`);
    this.isEnqueueModalOpen = false;
  }
}
