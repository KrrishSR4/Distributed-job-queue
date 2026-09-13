import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { ThemeService } from '../../../services/theme.service.js';
import { DlqService } from '../../../services/dlq.service.js';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside [ngClass]="{'w-60': !collapsed, 'w-16': collapsed}" 
           class="h-screen bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col flex-shrink-0 transition-all duration-200 z-30 select-none">
      
      <!-- Logo / Brand Header -->
      <div class="h-14 flex items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800">
        <div class="flex items-center gap-2.5 overflow-hidden">
          <div class="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold font-mono text-xs shadow-xs">
            JQ
          </div>
          <div *ngIf="!collapsed" class="flex flex-col min-w-0">
            <span class="text-xs font-bold text-slate-900 dark:text-slate-100 tracking-tight whitespace-nowrap">JobQueue HQ</span>
            <span class="text-[10px] text-slate-400 font-mono tracking-wide uppercase">v1.4.0 • Enterprise</span>
          </div>
        </div>

        <button (click)="toggleCollapse()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <svg [ngClass]="{'rotate-180': collapsed}" class="w-4 h-4 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <!-- Navigation Section -->
      <div class="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        <div *ngIf="!collapsed" class="px-3 py-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Overview & Fleet
        </div>

        <a routerLink="/dashboard" routerLinkActive="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium"
           class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors group">
          <svg class="w-4 h-4 flex-shrink-0 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span *ngIf="!collapsed" class="truncate">Dashboard</span>
        </a>

        <a routerLink="/jobs" routerLinkActive="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium"
           class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors group">
          <svg class="w-4 h-4 flex-shrink-0 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span *ngIf="!collapsed" class="truncate">Jobs Explorer</span>
        </a>

        <a routerLink="/workers" routerLinkActive="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium"
           class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors group">
          <svg class="w-4 h-4 flex-shrink-0 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
          <span *ngIf="!collapsed" class="truncate">Worker Nodes</span>
        </a>

        <a routerLink="/queues" routerLinkActive="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium"
           class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors group">
          <svg class="w-4 h-4 flex-shrink-0 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span *ngIf="!collapsed" class="truncate">Queues</span>
        </a>

        <div *ngIf="!collapsed" class="pt-4 px-3 py-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Automation & Reliability
        </div>

        <a routerLink="/scheduler" routerLinkActive="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium"
           class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors group">
          <svg class="w-4 h-4 flex-shrink-0 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span *ngIf="!collapsed" class="truncate">Scheduler (Cron)</span>
        </a>

        <a routerLink="/dlq" routerLinkActive="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium"
           class="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors group">
          <div class="flex items-center gap-3 min-w-0">
            <svg class="w-4 h-4 flex-shrink-0 text-rose-500 dark:text-rose-400 group-hover:text-rose-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span *ngIf="!collapsed" class="truncate">Dead Letter Queue</span>
          </div>
          <span *ngIf="(dlqCount$ | async) as count" 
                class="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400">
            {{ count }}
          </span>
        </a>

        <div *ngIf="!collapsed" class="pt-4 px-3 py-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Telemetry & Config
        </div>

        <a routerLink="/analytics" routerLinkActive="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium"
           class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors group">
          <svg class="w-4 h-4 flex-shrink-0 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span *ngIf="!collapsed" class="truncate">Analytics</span>
        </a>

        <a routerLink="/settings" routerLinkActive="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium"
           class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors group">
          <svg class="w-4 h-4 flex-shrink-0 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span *ngIf="!collapsed" class="truncate">Settings</span>
        </a>
      </div>

      <!-- User / Account Section -->
      <div class="p-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-col gap-2">
        <div class="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <div class="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs">
            OP
          </div>
          <div *ngIf="!collapsed" class="flex flex-col min-w-0 flex-1">
            <span class="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">DevOps Operator</span>
            <span class="text-[10px] text-slate-400 truncate">admin@jobqueue.io</span>
          </div>
        </div>

        <button (click)="themeService.toggleTheme()" 
                class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span *ngIf="!collapsed" class="text-[11px] font-medium">Theme: <span class="capitalize font-semibold text-slate-800 dark:text-slate-200">{{ (themeService.theme$ | async) }}</span></span>
          <svg *ngIf="(themeService.theme$ | async) === 'light'" class="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg *ngIf="(themeService.theme$ | async) === 'dark'" class="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </div>

    </aside>
  `
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter();

  themeService = inject(ThemeService);
  dlqService = inject(DlqService);

  constructor() {
    this.dlqCount$ = this.dlqService.dlqJobs$.pipe(
      map(jobs => jobs.length)
    );
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }
}
