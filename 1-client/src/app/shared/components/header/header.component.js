import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService } from '../../../services/job.service.js';
import { NotificationService } from '../../../services/notification.service.js';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="h-14 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800 px-6 flex items-center justify-between sticky top-0 z-20 transition-colors">
      
      <!-- Left: Title & Environment -->
      <div class="flex items-center gap-3">
        <h1 class="text-sm font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">{{ title }}</h1>
        <span class="text-zinc-300 dark:text-zinc-700 font-light">/</span>
        <div class="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-100/80 dark:bg-zinc-900 text-[10px] font-mono text-zinc-600 dark:text-zinc-400 font-medium">
          <span class="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 opacity-60"></span>
          <span>prod-us-east-1</span>
        </div>
      </div>

      <!-- Right: Search, Enqueue Job, User -->
      <div class="flex items-center gap-4">
        
        <div class="relative hidden sm:block w-64">
          <input type="text" 
                 placeholder="Search jobs, queues, workers..." 
                 class="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 rounded-lg px-3 py-1.5 pl-8 text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors">
          <svg class="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span class="absolute right-2 top-1.5 px-1 py-0.5 rounded-[4px] text-[9px] font-mono font-medium text-zinc-400 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">⌘K</span>
        </div>

        <button (click)="openEnqueueModal.emit()" 
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-black dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium shadow-sm transition-all active:scale-95">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
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
