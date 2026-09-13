import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component.js';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component.js';
import { WorkerService } from '../../services/worker.service.js';
import { NotificationService } from '../../services/notification.service.js';

@Component({
  selector: 'app-workers',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent, DataTableComponent],
  template: `
    <div class="space-y-6">
      
      <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 class="text-base font-bold text-slate-900 dark:text-slate-100">Worker Fleet Cluster</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">8 active worker nodes distributed across us-east-1 availability zones</p>
        </div>

        <div class="flex items-center gap-3 text-xs font-mono">
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
            <span class="text-slate-500 uppercase">Active Nodes:</span>
            <span class="text-emerald-600 dark:text-emerald-400 font-bold">8 / 8</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
            <span class="text-slate-500 uppercase">Total Concurrency:</span>
            <span class="text-blue-600 dark:text-blue-400 font-bold">160 threads</span>
          </div>
        </div>
      </div>

      <app-data-table [columns]="columns" [showPagination]="false">
        <tr *ngFor="let worker of (workerService.workers$ | async)" class="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors border-b border-slate-200/60 dark:border-slate-800/60">
          
          <td class="px-4 py-3 font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
            <div class="flex flex-col">
              <span>{{ worker.name }}</span>
              <span class="text-[10px] font-mono text-slate-400">IP: {{ worker.ip }}</span>
            </div>
          </td>

          <td class="px-4 py-3">
            <app-status-badge [status]="worker.status"></app-status-badge>
          </td>

          <td class="px-4 py-3 font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
            {{ worker.currentJob }}
          </td>

          <td class="px-4 py-3 font-mono text-xs text-slate-700 dark:text-slate-300">
            {{ worker.processed }}
          </td>

          <td class="px-4 py-3 font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            {{ calcSuccessRate(worker) }}%
          </td>

          <td class="px-4 py-3 font-mono text-xs text-slate-700 dark:text-slate-300">
            {{ worker.rate }} j/s
          </td>

          <td class="px-4 py-3 font-mono text-xs text-slate-500">
            {{ worker.uptime }}
          </td>

          <td class="px-4 py-3 text-right">
            <div class="flex items-center justify-end gap-2">
              <button (click)="restartWorker(worker.id)" 
                      class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-md transition-colors">
                Restart
              </button>
              <button (click)="toggleState(worker.id)" 
                      class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-md transition-colors">
                {{ worker.status === 'idle' ? 'Resume' : 'Drain' }}
              </button>
            </div>
          </td>

        </tr>
      </app-data-table>

    </div>
  `
})
export class WorkersComponent {
  columns = [
    { header: 'Worker Node' },
    { header: 'Status' },
    { header: 'Current Job' },
    { header: 'Jobs Processed' },
    { header: 'Success Rate' },
    { header: 'Processing Rate' },
    { header: 'Uptime' },
    { header: 'Actions' }
  ];

  workerService = inject(WorkerService);
  notificationService = inject(NotificationService);

  calcSuccessRate(worker) {
    if (!worker.processed) return '100.0';
    return ((worker.success / worker.processed) * 100).toFixed(1);
  }

  restartWorker(id) {
    this.workerService.restartWorker(id);
    this.notificationService.info('Worker Restarted', `Sent SIGTERM to ${id} and re-initialized node process.`);
  }

  toggleState(id) {
    this.workerService.toggleWorkerStatus(id);
    this.notificationService.success('Worker State Updated', `Updated execution state for ${id}.`);
  }
}
