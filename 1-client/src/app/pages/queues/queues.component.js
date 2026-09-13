import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component.js';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component.js';
import { ModalComponent } from '../../shared/components/modal/modal.component.js';
import { QueueService } from '../../services/queue.service.js';
import { NotificationService } from '../../services/notification.service.js';

@Component({
  selector: 'app-queues',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent, DataTableComponent, ModalComponent],
  template: `
    <div class="space-y-6">
      
      <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div>
          <h2 class="text-base font-bold text-slate-900 dark:text-slate-100">Queue Management</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">Configure priorities, concurrencies, and queue states</p>
        </div>
        <button (click)="isCreateModalOpen = true" 
                class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all">
          + Create Queue
        </button>
      </div>

      <app-data-table [columns]="columns" [showPagination]="false">
        <tr *ngFor="let q of (queueService.queues$ | async)" class="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors border-b border-slate-200/60 dark:border-slate-800/60">
          
          <td class="px-4 py-3 font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
            {{ q.name }}
          </td>

          <td class="px-4 py-3 font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
            {{ q.pending }}
          </td>

          <td class="px-4 py-3 font-mono text-xs text-slate-700 dark:text-slate-300">
            {{ Math.floor(q.depth * 0.4) }}
          </td>

          <td class="px-4 py-3 font-mono text-xs text-emerald-600 dark:text-emerald-400">
            {{ q.depth * 14 }}
          </td>

          <td class="px-4 py-3 font-mono text-xs text-rose-600 dark:text-rose-400 font-semibold">
            {{ q.failed }}
          </td>

          <td class="px-4 py-3 font-mono text-xs text-slate-700 dark:text-slate-300">
            {{ q.rate }} j/s
          </td>

          <td class="px-4 py-3">
            <app-status-badge [status]="q.status"></app-status-badge>
          </td>

          <td class="px-4 py-3 text-right">
            <div class="flex items-center justify-end gap-2">
              <button (click)="toggleState(q)" 
                      [ngClass]="q.status === 'active' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400'"
                      class="px-2.5 py-1 rounded border text-xs font-semibold transition-colors">
                {{ q.status === 'active' ? 'Pause' : 'Resume' }}
              </button>
              <button (click)="purge(q)" 
                      class="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 rounded text-xs font-semibold transition-colors">
                Purge
              </button>
            </div>
          </td>

        </tr>
      </app-data-table>

      <app-modal [isOpen]="isCreateModalOpen" 
                 (isOpenChange)="isCreateModalOpen = $event" 
                 title="Create New Job Queue" 
                 size="md">
        <form (ngSubmit)="onCreateQueue()" class="space-y-4 font-sans text-xs">
          <div>
            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Queue Name</label>
            <input type="text" [(ngModel)]="newQueueName" name="newQueueName" required
                   placeholder="e.g. stripe-webhooks-v2"
                   class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono">
          </div>

          <div>
            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority Weight (1-10)</label>
            <input type="number" [(ngModel)]="newQueuePriority" name="newQueuePriority" min="1" max="10"
                   class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono">
          </div>

          <div>
            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Max Concurrency Limit</label>
            <input type="number" [(ngModel)]="newQueueConcurrency" name="newQueueConcurrency" min="1" max="500"
                   class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono">
          </div>

          <div footer class="flex items-center gap-2">
            <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs">
              Create Queue
            </button>
            <button type="button" (click)="isCreateModalOpen = false" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      </app-modal>

    </div>
  `
})
export class QueuesComponent {
  columns = [
    { header: 'Queue Name' },
    { header: 'Pending' },
    { header: 'Processing' },
    { header: 'Completed' },
    { header: 'Failed' },
    { header: 'Throughput' },
    { header: 'Status' },
    { header: 'Actions' }
  ];

  Math = Math;
  isCreateModalOpen = false;
  newQueueName = '';
  newQueuePriority = 5;
  newQueueConcurrency = 50;

  queueService = inject(QueueService);
  notificationService = inject(NotificationService);

  toggleState(q) {
    this.queueService.toggleQueueState(q.id);
    const nextState = q.status === 'active' ? 'paused' : 'resumed';
    this.notificationService.info('Queue Updated', `Queue [${q.name}] was ${nextState}.`);
  }

  purge(q) {
    this.queueService.purgeQueue(q.id);
    this.notificationService.warning('Queue Purged', `Cleared all pending items in queue [${q.name}].`);
  }

  onCreateQueue() {
    if (!this.newQueueName) return;
    this.queueService.createQueue(this.newQueueName, this.newQueuePriority, this.newQueueConcurrency);
    this.notificationService.success('Queue Created', `Created new queue [${this.newQueueName}].`);
    this.isCreateModalOpen = false;
    this.newQueueName = '';
  }
}
