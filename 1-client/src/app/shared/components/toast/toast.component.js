import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service.js';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <div *ngFor="let toast of (notificationService.toasts$ | async)" 
           [ngClass]="getToastClass(toast.type)" 
           class="pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-xl transition-all duration-300 transform translate-y-0">
        <div class="flex-shrink-0 mt-0.5">
          <svg *ngIf="toast.type === 'success'" class="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg *ngIf="toast.type === 'error'" class="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg *ngIf="toast.type === 'warning'" class="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <svg *ngIf="toast.type === 'info'" class="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div class="flex-1 min-w-0">
          <h4 class="text-xs font-semibold text-slate-100 uppercase tracking-wider">{{ toast.title }}</h4>
          <p class="text-xs text-slate-300 mt-0.5 leading-relaxed">{{ toast.message }}</p>
        </div>

        <button (click)="notificationService.remove(toast.id)" class="text-slate-400 hover:text-slate-200">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  `
})
export class ToastComponent {
  notificationService = inject(NotificationService);

  getToastClass(type) {
    switch (type) {
      case 'success': return 'bg-slate-900 border-emerald-500/30 text-slate-100';
      case 'error': return 'bg-slate-900 border-rose-500/30 text-slate-100';
      case 'warning': return 'bg-slate-900 border-amber-500/30 text-slate-100';
      case 'info': return 'bg-slate-900 border-blue-500/30 text-slate-100';
      default: return 'bg-slate-900 border-slate-700 text-slate-100';
    }
  }
}
