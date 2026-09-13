import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="badgeClasses" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium tracking-tight">
      <span [ngClass]="dotClasses" class="w-1.5 h-1.5 rounded-full"></span>
      <span class="capitalize">{{ status }}</span>
    </span>
  `
})
export class StatusBadgeComponent {
  @Input() status = 'queued';

  get badgeClasses() {
    const s = (this.status || '').toLowerCase();
    switch (s) {
      case 'completed':
      case 'active':
      case 'online':
      case 'enabled':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case 'running':
      case 'busy':
        return 'bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
      case 'queued':
      case 'idle':
        return 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
      case 'failed':
      case 'degraded':
      case 'disabled':
        return 'bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
      case 'paused':
      case 'warning':
        return 'bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
      case 'critical':
        return 'bg-purple-50 text-purple-700 border border-purple-200/80 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20';
      case 'high':
        return 'bg-orange-50 text-orange-700 border border-orange-200/80 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20';
      case 'normal':
        return 'bg-sky-50 text-sky-700 border border-sky-200/80 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20';
      case 'low':
        return 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  }

  get dotClasses() {
    const s = (this.status || '').toLowerCase();
    switch (s) {
      case 'completed':
      case 'active':
      case 'online':
      case 'enabled':
        return 'bg-emerald-500 dark:bg-emerald-400';
      case 'running':
      case 'busy':
        return 'bg-blue-500 dark:bg-blue-400 animate-pulse';
      case 'queued':
      case 'idle':
        return 'bg-slate-400 dark:bg-slate-500';
      case 'failed':
      case 'degraded':
      case 'disabled':
        return 'bg-rose-500 dark:bg-rose-400';
      case 'paused':
      case 'warning':
        return 'bg-amber-500 dark:bg-amber-400';
      default:
        return 'bg-slate-400 dark:bg-slate-500';
    }
  }
}
