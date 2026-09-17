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
    <div class="flex h-screen w-screen overflow-hidden bg-[#fcfcfd] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans">
      
      <!-- Sidebar Navigation -->
      <app-sidebar [(collapsed)]="sidebarCollapsed"></app-sidebar>

      <!-- Main Workspace Area -->
      <div class="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white dark:bg-[#09090b] relative z-0 border-l border-zinc-200 dark:border-zinc-800/80 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
        
        <!-- Header -->
        <app-header [title]="pageTitle" (openEnqueueModal)="isEnqueueModalOpen = true"></app-header>

        <!-- Scrollable Page Content -->
        <main class="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 space-y-8">
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
              <label class="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Job Type / Task Handler</label>
              <select [(ngModel)]="newJobType" name="newJobType" required
                      class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 font-mono transition-colors">
                <option value="ProcessStripeInvoice">ProcessStripeInvoice</option>
                <option value="SendWelcomeEmail">SendWelcomeEmail</option>
                <option value="TranscodeVideoTask">TranscodeVideoTask</option>
                <option value="AggregateMetricsJob">AggregateMetricsJob</option>
                <option value="SyncUserMetadata">SyncUserMetadata</option>
                <option value="GenerateMonthlyReport">GenerateMonthlyReport</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Target Queue</label>
              <select [(ngModel)]="newJobQueue" name="newJobQueue" required
                      class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 font-mono transition-colors">
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
              <label class="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Priority Tier</label>
              <select [(ngModel)]="newJobPriority" name="newJobPriority"
                      class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 font-mono transition-colors">
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Max Retry Limit</label>
              <input type="number" [(ngModel)]="newJobRetryLimit" name="newJobRetryLimit" min="1" max="10"
                     class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 font-mono transition-colors">
            </div>

            <div>
              <label class="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Schedule Delay</label>
              <select [(ngModel)]="newJobSchedule" name="newJobSchedule"
                      class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 font-mono transition-colors">
                <option value="NOW">Immediate Execution</option>
                <option value="5m">Delay 5 Minutes</option>
                <option value="1h">Delay 1 Hour</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Payload JSON Object</label>
            <textarea [(ngModel)]="newJobPayloadJson" name="newJobPayloadJson" rows="4" required
                      class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-xs font-mono text-zinc-600 dark:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 leading-relaxed transition-colors"></textarea>
          </div>

          <div footer class="flex items-center gap-2">
            <button type="submit" class="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-black dark:hover:bg-white text-white dark:text-zinc-900 font-semibold rounded-lg shadow-sm transition-colors">
              Submit & Enqueue
            </button>
            <button type="button" (click)="isEnqueueModalOpen = false" class="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
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
          <!-- Visual Lifecycle Timeline Step Progress -->
          <div class="bg-zinc-50 dark:bg-[#121214] p-5 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
            <span class="text-[10px] uppercase font-mono font-semibold text-zinc-400 block mb-4 tracking-widest">Job Execution Lifecycle Step</span>
            
            <div class="flex items-center justify-between relative">
              <!-- Horizontal Bar -->
              <div class="absolute top-1/2 left-5 right-5 h-px bg-zinc-200 dark:bg-zinc-800 -translate-y-1/2 -z-0"></div>

              <!-- Step 1: Created -->
              <div class="relative z-10 flex flex-col items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border border-zinc-900 flex items-center justify-center font-bold text-[10px] shadow-sm">✓</div>
                <span class="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">Created</span>
              </div>

              <!-- Step 2: Queued -->
              <div class="relative z-10 flex flex-col items-center gap-2">
                <div [ngClass]="job.status === 'queued' ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100' : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'" 
                     class="w-6 h-6 rounded-full border flex items-center justify-center font-bold text-[10px] shadow-sm">
                  {{ job.status === 'queued' ? '2' : '✓' }}
                </div>
                <span class="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">Queued</span>
              </div>

              <!-- Step 3: Processing -->
              <div class="relative z-10 flex flex-col items-center gap-2">
                <div [ngClass]="job.status === 'running' ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 animate-pulse' : (job.status === 'completed' ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100' : (job.status === 'failed' ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100' : 'bg-white dark:bg-[#121214] text-zinc-400 border-zinc-200 dark:border-zinc-700'))" 
                     class="w-6 h-6 rounded-full border flex items-center justify-center font-bold text-[10px] shadow-sm">
                  {{ job.status === 'completed' ? '✓' : (job.status === 'failed' ? '!' : '3') }}
                </div>
                <span class="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">Processing</span>
              </div>

              <!-- Step 4: Outcome (Completed / Failed) -->
              <div class="relative z-10 flex flex-col items-center gap-2">
                <div [ngClass]="job.status === 'completed' ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100' : (job.status === 'failed' ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100' : 'bg-white dark:bg-[#121214] text-zinc-400 border-zinc-200 dark:border-zinc-700')" 
                     class="w-6 h-6 rounded-full border flex items-center justify-center font-bold text-[10px] shadow-sm">
                  {{ job.status === 'completed' ? '✓' : (job.status === 'failed' ? '✗' : '4') }}
                </div>
                <span class="text-[11px] font-semibold capitalize" [ngClass]="job.status === 'failed' ? 'text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-zinc-300'">
                  {{ job.status === 'failed' ? 'Failed' : 'Completed' }}
                </span>
              </div>

            </div>
          </div>

          <!-- Metadata Specs Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-[#09090b] p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 text-xs">
            <div>
              <span class="text-[10px] uppercase font-mono text-zinc-400 block tracking-wider">Status</span>
              <div class="mt-1.5">
                <app-status-badge [status]="job.status"></app-status-badge>
              </div>
            </div>
            <div>
              <span class="text-[10px] uppercase font-mono text-zinc-400 block tracking-wider">Priority</span>
              <div class="mt-1.5">
                <app-status-badge [status]="job.priority"></app-status-badge>
              </div>
            </div>
            <div>
              <span class="text-[10px] uppercase font-mono text-zinc-400 block tracking-wider">Queue</span>
              <span class="font-mono font-semibold text-zinc-800 dark:text-zinc-200 mt-1 block truncate">{{ job.queue }}</span>
            </div>
            <div>
              <span class="text-[10px] uppercase font-mono text-zinc-400 block tracking-wider">Worker Assigned</span>
              <span class="font-mono font-semibold text-zinc-800 dark:text-zinc-200 mt-1 block truncate">{{ job.worker }}</span>
            </div>
          </div>

          <!-- Error Details Callout -->
          <div *if="job.error" class="p-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <span class="text-[10px] uppercase font-mono text-zinc-500 dark:text-zinc-400 font-bold block mb-1">Execution Failure Reason</span>
            <p class="text-xs font-mono text-zinc-800 dark:text-zinc-200 leading-relaxed break-words">{{ job.error }}</p>
          </div>

          <!-- Payload JSON -->
          <div>
            <span class="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Payload Object</span>
            <pre class="bg-zinc-50 dark:bg-[#121214] p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-400 overflow-x-auto max-h-40 leading-relaxed">{{ formatJson(job.payload) }}</pre>
          </div>

          <!-- Logs Timeline -->
          <div>
            <span class="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Execution Log Stream</span>
            <div class="bg-zinc-50 dark:bg-[#121214] rounded-xl border border-zinc-200/80 dark:border-zinc-800 p-4 max-h-36 overflow-y-auto space-y-1 font-mono text-xs text-zinc-600 dark:text-zinc-400">
              <div *for="let log of job.logs" class="hover:bg-zinc-100 dark:hover:bg-zinc-900 px-2 py-1 rounded transition-colors">
                {{ log }}
              </div>
            </div>
          </div>

          <!-- Modal Action Buttons -->
          <div footer class="flex items-center gap-2">
            <button (click)="retryJob(job.id)" class="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-black dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium rounded-lg shadow-sm transition-colors">
              Retry Job
            </button>
            <button (click)="cancelJob(job.id)" class="px-4 py-2 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 text-xs font-medium rounded-lg transition-colors">
              Cancel Job
            </button>
            <button (click)="jobService.clearSelectedJob()" class="px-4 py-2 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-lg transition-colors">
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
