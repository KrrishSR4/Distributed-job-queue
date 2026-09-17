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
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case 'running':
      case 'busy':
        return 'bg-zinc-100 text-zinc-900 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700';
      case 'queued':
      case 'idle':
        return 'bg-zinc-50 text-zinc-600 border border-zinc-200 dark:bg-zinc-900/50 dark:text-zinc-400 dark:border-zinc-800';
      case 'failed':
      case 'degraded':
      case 'disabled':
        return 'bg-rose-50 text-rose-700 border border-rose-200/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
      case 'paused':
      case 'warning':
        return 'bg-amber-50 text-amber-700 border border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
      case 'critical':
      case 'high':
        return 'bg-zinc-900 text-zinc-50 border border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100';
      case 'normal':
        return 'bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';
      case 'low':
        return 'bg-zinc-50 text-zinc-500 border border-zinc-200/80 dark:bg-zinc-900 dark:text-zinc-500 dark:border-zinc-800';
      default:
        return 'bg-zinc-50 text-zinc-600 border border-zinc-200 dark:bg-zinc-900/50 dark:text-zinc-400 dark:border-zinc-800';
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
        return 'bg-zinc-900 dark:bg-zinc-100 animate-pulse';
      case 'queued':
      case 'idle':
        return 'bg-zinc-400 dark:bg-zinc-500';
      case 'failed':
      case 'degraded':
      case 'disabled':
        return 'bg-rose-500 dark:bg-rose-400';
      case 'paused':
      case 'warning':
        return 'bg-amber-500 dark:bg-amber-400';
      default:
        return 'bg-zinc-400 dark:bg-zinc-500';
    }
  }
}
