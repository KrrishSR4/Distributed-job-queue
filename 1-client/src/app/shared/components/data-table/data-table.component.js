import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-slate-50/80 dark:bg-slate-950/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
              <th *ngFor="let col of columns" class="px-4 py-3 font-mono text-[11px] whitespace-nowrap">
                {{ col.header }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
            <ng-content></ng-content>
          </tbody>
        </table>
      </div>

      <div *ngIf="showPagination" class="flex items-center justify-between px-4 py-3 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div class="flex items-center gap-2 font-mono text-[11px]">
          <span>Showing page {{ currentPage }} of {{ totalPages || 1 }}</span>
          <span>•</span>
          <span>{{ totalItems }} items total</span>
        </div>
        <div class="flex items-center gap-1">
          <button (click)="prevPage()" [disabled]="currentPage <= 1" 
                  class="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200 font-medium transition-colors shadow-2xs">
            Previous
          </button>
          <button (click)="nextPage()" [disabled]="currentPage >= totalPages" 
                  class="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200 font-medium transition-colors shadow-2xs">
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
