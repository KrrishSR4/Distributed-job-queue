import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService } from '../../../services/job.service.js';
import { NotificationService } from '../../../services/notification.service.js';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="h-14 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
      
      <!-- Left: Title & Environment -->
      <div class="flex items-center gap-3">
        <h1 class="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">{{ title }}</h1>
        <span class="text-slate-300 dark:text-slate-700">/</span>
        <div class="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>prod-us-east-1</span>
        </div>
      </div>

      <!-- Right: Search, Enqueue Job, User -->
      <div class="flex items-center gap-3">
        
        <div class="relative hidden sm:block w-60">
          <input type="text" 
                 placeholder="Search jobs, queues, workers..." 
                 class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 pl-8 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors">
          <svg class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span class="absolute right-2 top-1.5 px-1 py-0.2 rounded text-[10px] font-mono text-slate-400 bg-slate-200/60 dark:bg-slate-800">⌘K</span>
        </div>

        <button (click)="openEnqueueModal.emit()" 
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-95">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Enqueue Job</span>
        </button>

      </div>

    </header>
  `
})
export class HeaderComponent {
  @Input() title = 'Dashboard';
  @Output() openEnqueueModal = new EventEmitter();

  jobService = inject(JobService);
  notificationService = inject(NotificationService);
}
