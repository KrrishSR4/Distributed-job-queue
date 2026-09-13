import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component.js';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component.js';
import { ModalComponent } from '../../shared/components/modal/modal.component.js';
import { DlqService } from '../../services/dlq.service.js';

@Component({
  selector: 'app-dlq',
  standalone: true,
  imports: [CommonModule, DataTableComponent, EmptyStateComponent, ModalComponent],
  template: `
    <div class="space-y-6">
      
      <div class="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h2 class="text-base font-bold text-rose-900 dark:text-rose-100">Dead Letter Queue (DLQ)</h2>
            <p class="text-xs text-rose-700/80 dark:text-rose-300/80">Unrecoverable failed job buffer requiring operator review</p>
          </div>
        </div>

        <div *ngIf="(dlqService.dlqJobs$ | async).length > 0" class="flex items-center gap-2">
          <button (click)="dlqService.retryAll()" 
                  class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all">
            Retry All Jobs
          </button>
          <button (click)="dlqService.purgeAll()" 
                  class="px-3 py-1.5 bg-rose-100 dark:bg-rose-600/30 hover:bg-rose-200 text-rose-700 dark:text-rose-200 border border-rose-300 dark:border-rose-500/40 rounded-lg text-xs font-semibold transition-all">
            Purge DLQ
          </button>
        </div>
      </div>

      <app-data-table *ngIf="(dlqService.dlqJobs$ | async).length > 0" [columns]="columns" [showPagination]="false">
        <tr *ngFor="let item of (dlqService.dlqJobs$ | async)" class="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors border-b border-slate-200/60 dark:border-slate-800/60">
          
          <td class="px-4 py-3 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">
            {{ item.jobId }}
          </td>

          <td class="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 text-xs">
            {{ item.type }}
          </td>

          <td class="px-4 py-3 font-mono text-xs max-w-xs">
            <p class="truncate text-rose-700 dark:text-rose-300 font-semibold" [title]="item.reason">{{ item.reason }}</p>
          </td>

          <td class="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-400">
            <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400">{{ item.retryCount }} / {{ item.maxRetries }}</span>
          </td>

          <td class="px-4 py-3 font-mono text-slate-500 text-xs">
            {{ item.failedAt }}
          </td>

          <td class="px-4 py-3 font-mono text-slate-600 dark:text-slate-400 text-xs">
            worker-node-06
          </td>

          <td class="px-4 py-3 text-right">
            <div class="flex items-center justify-end gap-2">
              <button (click)="inspectStackTrace(item)" 
                      class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded text-xs font-semibold transition-colors">
                Inspect
              </button>
              <button (click)="dlqService.retryJob(item.id)" 
                      class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors shadow-2xs">
                Retry
              </button>
              <button (click)="dlqService.deleteJob(item.id)" 
                      class="px-2.5 py-1 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 rounded text-xs font-semibold transition-colors">
                Delete
              </button>
            </div>
          </td>

        </tr>
      </app-data-table>

      <app-empty-state *ngIf="(dlqService.dlqJobs$ | async).length === 0" 
                       title="Dead Letter Queue is empty" 
                       description="No unrecoverable job execution failures present in the DLQ buffer. All systems operational.">
      </app-empty-state>

      <app-modal [isOpen]="isTraceModalOpen" 
                 (isOpenChange)="isTraceModalOpen = $event" 
                 title="Failure Stack Trace Inspector" 
                 [subtitle]="selectedItem?.jobId"
                 size="2xl">
        <div *ngIf="selectedItem" class="space-y-4 font-sans text-xs">
          
          <div class="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-lg">
            <span class="text-[10px] uppercase font-mono text-rose-600 dark:text-rose-400 font-bold block mb-1">Reason</span>
            <p class="font-mono text-rose-800 dark:text-rose-200 leading-relaxed">{{ selectedItem.reason }}</p>
          </div>

          <div>
            <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">Stack Trace Dump</span>
            <pre class="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono text-rose-600 dark:text-rose-400 overflow-x-auto leading-relaxed max-h-64">{{ selectedItem.stackTrace }}</pre>
          </div>

          <div footer class="flex items-center gap-2">
            <button (click)="dlqService.retryJob(selectedItem.id); isTraceModalOpen = false" 
                    class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
              Retry Job Now
            </button>
            <button (click)="isTraceModalOpen = false" 
                    class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg">
              Close
            </button>
          </div>

        </div>
      </app-modal>

    </div>
  `
})
export class DlqComponent {
  columns = [
    { header: 'Job ID' },
    { header: 'Job Type' },
    { header: 'Failure Reason' },
    { header: 'Retry Count' },
    { header: 'Failed At' },
    { header: 'Worker' },
    { header: 'Actions' }
  ];

  isTraceModalOpen = false;
  selectedItem = null;

  dlqService = inject(DlqService);

  inspectStackTrace(item) {
    this.selectedItem = item;
    this.isTraceModalOpen = true;
  }
}
