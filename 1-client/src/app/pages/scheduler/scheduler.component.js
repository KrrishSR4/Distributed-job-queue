import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component.js';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component.js';
import { ModalComponent } from '../../shared/components/modal/modal.component.js';
import { SchedulerService } from '../../services/scheduler.service.js';
import { NotificationService } from '../../services/notification.service.js';

@Component({
  selector: 'app-scheduler',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent, DataTableComponent, ModalComponent],
  template: `
    <div class="space-y-6">
      
      <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div>
          <h2 class="text-base font-bold text-slate-900 dark:text-slate-100">Cron Scheduler Engine</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">Automated recurring tasks and timed queue triggers</p>
        </div>
        <div class="flex items-center gap-2">
          <button (click)="isCreateScheduleOpen = true" 
                  class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all">
            + Create Schedule
          </button>
        </div>
      </div>

      <app-data-table [columns]="columns" [showPagination]="false">
        <tr *ngFor="let job of (schedulerService.schedulerJobs$ | async)" class="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors border-b border-slate-200/60 dark:border-slate-800/60">
          
          <td class="px-4 py-3 font-medium text-slate-900 dark:text-slate-100 text-xs">
            <div class="flex flex-col">
              <span class="font-bold">{{ job.name }}</span>
              <span class="text-[10px] font-mono text-slate-400">{{ job.type }}</span>
            </div>
          </td>

          <td class="px-4 py-3 font-mono text-xs text-blue-600 dark:text-blue-400">
            <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">{{ job.cron }}</span>
          </td>

          <td class="px-4 py-3 font-mono text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            {{ job.nextRun }}
          </td>

          <td class="px-4 py-3 font-mono text-slate-500 text-xs">
            {{ job.lastRun }}
          </td>

          <td class="px-4 py-3">
            <app-status-badge [status]="job.status"></app-status-badge>
          </td>

          <td class="px-4 py-3 text-right">
            <div class="flex items-center justify-end gap-2">
              <button (click)="triggerNow(job)" 
                      class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors shadow-2xs">
                Run Now
              </button>
              <button (click)="toggleJob(job)" 
                      [ngClass]="job.status === 'enabled' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200' : 'bg-emerald-600 text-white'"
                      class="px-2.5 py-1 rounded text-xs font-semibold transition-colors">
                {{ job.status === 'enabled' ? 'Disable' : 'Enable' }}
              </button>
              <button (click)="editJob(job)" 
                      class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded text-xs font-semibold transition-colors">
                Edit
              </button>
            </div>
          </td>

        </tr>
      </app-data-table>

      <app-modal [isOpen]="isCreateScheduleOpen" 
                 (isOpenChange)="isCreateScheduleOpen = $event" 
                 title="Create Scheduled Cron Task" 
                 size="md">
        <form (ngSubmit)="onCreateSchedule()" class="space-y-4 font-sans text-xs">
          <div>
            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Task Name</label>
            <input type="text" [(ngModel)]="newScheduleName" name="newScheduleName" required
                   placeholder="e.g. Daily DB Compression"
                   class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono">
          </div>

          <div>
            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Cron Expression (e.g. 0 2 * * *)</label>
            <input type="text" [(ngModel)]="newScheduleCron" name="newScheduleCron" required
                   placeholder="0 2 * * *"
                   class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono">
          </div>

          <div footer class="flex items-center gap-2">
            <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs">
              Create Schedule
            </button>
            <button type="button" (click)="isCreateScheduleOpen = false" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      </app-modal>

    </div>
  `
})
export class SchedulerComponent {
  columns = [
    { header: 'Job' },
    { header: 'Schedule' },
    { header: 'Next Run' },
    { header: 'Last Run' },
    { header: 'Status' },
    { header: 'Actions' }
  ];

  isCreateScheduleOpen = false;
  newScheduleName = '';
  newScheduleCron = '0 0 * * *';

  schedulerService = inject(SchedulerService);
  notificationService = inject(NotificationService);

  toggleJob(job) {
    this.schedulerService.toggleJobStatus(job.id);
    const nextState = job.status === 'enabled' ? 'disabled' : 'enabled';
    this.notificationService.info('Scheduler Updated', `Scheduled task [${job.name}] was ${nextState}.`);
  }

  triggerNow(job) {
    this.schedulerService.triggerNow(job.id);
    this.notificationService.success('Task Triggered', `Manually dispatched [${job.name}] to queue [${job.queue}].`);
  }

  editJob(job) {
    this.notificationService.info('Edit Schedule', `Opened edit dialog for task [${job.name}].`);
  }

  onCreateSchedule() {
    if (!this.newScheduleName) return;
    this.notificationService.success('Schedule Created', `Created cron schedule [${this.newScheduleName}].`);
    this.isCreateScheduleOpen = false;
    this.newScheduleName = '';
  }
}
