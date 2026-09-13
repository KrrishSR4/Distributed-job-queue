import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-12 space-y-3">
      <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span class="text-xs font-mono text-slate-400 uppercase tracking-widest">{{ text }}</span>
    </div>
  `
})
export class LoadingStateComponent {
  @Input() text = 'Loading metric pipeline...';
}
