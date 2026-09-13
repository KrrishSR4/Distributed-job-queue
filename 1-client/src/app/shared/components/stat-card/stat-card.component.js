import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 transition-all shadow-xs hover:border-slate-300 dark:hover:border-slate-700">
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{{ title }}</span>
        <div [ngClass]="iconContainerClass" class="w-7 h-7 rounded-lg flex items-center justify-center">
          <ng-content select="[icon]"></ng-content>
        </div>
      </div>
      <div class="mt-2.5 flex items-baseline justify-between">
        <div class="text-2xl font-semibold font-mono tracking-tight text-slate-900 dark:text-slate-100">{{ value }}</div>
        <div *ngIf="trend" [ngClass]="trendClass" class="flex items-center gap-1 text-xs font-medium">
          <span>{{ trend }}</span>
        </div>
      </div>
      <div *ngIf="subtitle" class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
        {{ subtitle }}
      </div>
    </div>
  `
})
export class StatCardComponent {
  @Input() title = '';
  @Input() value = '0';
  @Input() subtitle = '';
  @Input() trend = '';
  @Input() trendType = 'neutral';
  @Input() variant = 'default';

  get iconContainerClass() {
    switch (this.variant) {
      case 'success': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400';
      case 'warning': return 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400';
      case 'danger': return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400';
      case 'info': return 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400';
      default: return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
    }
  }

  get trendClass() {
    if (this.trendType === 'up') return 'text-emerald-600 dark:text-emerald-400';
    if (this.trendType === 'down') return 'text-rose-600 dark:text-rose-400';
    return 'text-slate-500 dark:text-slate-400';
  }
}
