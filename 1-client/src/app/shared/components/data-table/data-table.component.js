import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full bg-white dark:bg-[#09090b] border border-zinc-200/80 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-zinc-50/80 dark:bg-zinc-900/40 border-b border-zinc-200/80 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-widest">
              <th *ngFor="let col of columns" class="px-5 py-3.5 font-mono text-[10px] whitespace-nowrap">
                {{ col.header }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-200">
            <ng-content></ng-content>
          </tbody>
        </table>
      </div>

      <div *ngIf="showPagination" class="flex items-center justify-between px-5 py-3 bg-zinc-50/50 dark:bg-zinc-900/20 border-t border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
        <div class="flex items-center gap-2 font-mono text-[11px]">
          <span>Showing page {{ currentPage }} of {{ totalPages || 1 }}</span>
          <span class="text-zinc-300 dark:text-zinc-700">•</span>
          <span>{{ totalItems }} items total</span>
        </div>
        <div class="flex items-center gap-2">
          <button (click)="prevPage()" [disabled]="currentPage <= 1" 
                  class="px-3 py-1.5 rounded-md bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-700 dark:text-zinc-200 font-medium transition-colors shadow-sm text-[11px]">
            Previous
          </button>
          <button (click)="nextPage()" [disabled]="currentPage >= totalPages" 
                  class="px-3 py-1.5 rounded-md bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-700 dark:text-zinc-200 font-medium transition-colors shadow-sm text-[11px]">
            Next
          </button>
        </div>
      </div>
    </div>
  `
})
export class DataTableComponent {
  @Input() columns = [];
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Input() showPagination = true;
  @Output() pageChange = new EventEmitter();

  get totalPages() {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }
}
