import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div class="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-xs transition-opacity" (click)="close()"></div>

      <div [ngClass]="maxWidthClass" class="relative w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-10 my-8">
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div class="flex items-center gap-3">
            <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100">{{ title }}</h3>
            <span *ngIf="subtitle" class="text-xs text-slate-500 font-mono">{{ subtitle }}</span>
          </div>
          <button (click)="close()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="px-6 py-4 max-h-[75vh] overflow-y-auto">
          <ng-content></ng-content>
        </div>

        <div *ngIf="showFooter" class="flex items-center justify-end gap-3 px-6 py-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <ng-content select="[footer]"></ng-content>
        </div>
      </div>
    </div>
  `
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Modal Title';
  @Input() subtitle = '';
  @Input() size = 'md';
  @Input() showFooter = true;
  @Output() isOpenChange = new EventEmitter();
  @Output() closed = new EventEmitter();

  get maxWidthClass() {
    switch (this.size) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-lg';
      case 'xl': return 'max-w-2xl';
      case '2xl': return 'max-w-4xl';
      default: return 'max-w-lg';
    }
  }

  close() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
    this.closed.emit();
  }
}
