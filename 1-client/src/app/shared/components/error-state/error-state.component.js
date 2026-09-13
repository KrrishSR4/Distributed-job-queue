import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-between p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg text-rose-700 dark:text-rose-300 my-4">
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider">{{ title }}</h4>
          <p class="text-xs text-rose-600 dark:text-rose-300/80 mt-0.5">{{ message }}</p>
        </div>
      </div>
      <button *ngIf="showRetry" (click)="retry.emit()" class="px-3 py-1 bg-rose-100 dark:bg-rose-500/20 hover:bg-rose-200 text-rose-700 dark:text-rose-200 border border-rose-300 dark:border-rose-500/30 rounded text-xs font-medium transition-colors">
        Retry
      </button>
    </div>
  `
})
export class ErrorStateComponent {
  @Input() title = 'Failed to load telemetry data';
  @Input() message = 'Could not establish connection to metric collector.';
  @Input() showRetry = true;
  @Output() retry = new EventEmitter();
}
