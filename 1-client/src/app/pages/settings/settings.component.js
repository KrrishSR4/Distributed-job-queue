import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service.js';
import { NotificationService } from '../../services/notification.service.js';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl space-y-6">
      
      <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <h2 class="text-base font-bold text-slate-900 dark:text-slate-100">System Preferences & Settings</h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage dashboard theme, notification alerts, and auto-refresh intervals</p>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200/80 dark:border-slate-800 pb-2">General Settings</h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Telemetry Auto-Refresh Rate</label>
            <select [(ngModel)]="autoRefreshRate" 
                    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500">
              <option value="5s">Every 5 Seconds</option>
              <option value="10s">Every 10 Seconds</option>
              <option value="30s">Every 30 Seconds</option>
              <option value="OFF">Disabled (Manual Only)</option>
            </select>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Default Table Page Size</label>
            <select [(ngModel)]="pageSize" 
                    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500">
              <option value="10">10 Rows per page</option>
              <option value="25">25 Rows per page</option>
              <option value="50">50 Rows per page</option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200/80 dark:border-slate-800 pb-2">Appearance & Theme</h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div (click)="themeService.setTheme('light')" 
               [ngClass]="(themeService.theme$ | async) === 'light' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40'"
               class="p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-900 dark:text-slate-100">Light Clean Mode (Default)</h4>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">Bright, high-contrast B2B SaaS interface</p>
              </div>
            </div>
            <span *ngIf="(themeService.theme$ | async) === 'light'" class="text-blue-600 font-bold text-xs">✓ Active</span>
          </div>

          <div (click)="themeService.setTheme('dark')" 
               [ngClass]="(themeService.theme$ | async) === 'dark' ? 'border-blue-500 bg-blue-500/5' : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40'"
               class="p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-900 dark:text-slate-100">Dark Infrastructure Mode</h4>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">High-density dark background option</p>
              </div>
            </div>
            <span *ngIf="(themeService.theme$ | async) === 'dark'" class="text-blue-600 dark:text-blue-400 font-bold text-xs">✓ Active</span>
          </div>

        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200/80 dark:border-slate-800 pb-2">Notifications & Alerts</h3>
        
        <div class="space-y-3 text-xs">
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" [(ngModel)]="notifyOnFail" class="w-4 h-4 rounded bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-blue-600">
            <div>
              <span class="font-semibold text-slate-800 dark:text-slate-200 block">Toast Alert on Job Failure</span>
              <span class="text-slate-500 dark:text-slate-400 text-[11px]">Display toast alert whenever a job is moved to Dead Letter Queue</span>
            </div>
          </label>

          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" [(ngModel)]="notifyOnWorkerDegraded" class="w-4 h-4 rounded bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-blue-600">
            <div>
              <span class="font-semibold text-slate-800 dark:text-slate-200 block">Worker Degradation Warning</span>
              <span class="text-slate-500 dark:text-slate-400 text-[11px]">Notify when worker CPU or RAM utilization exceeds 90%</span>
            </div>
          </label>
        </div>
      </div>

      <div class="flex justify-end">
        <button (click)="saveSettings()" 
                class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors">
          Save Settings
        </button>
      </div>

    </div>
  `
})
export class SettingsComponent {
  autoRefreshRate = '5s';
  pageSize = '10';
  notifyOnFail = true;
  notifyOnWorkerDegraded = true;

  themeService = inject(ThemeService);
  notificationService = inject(NotificationService);

  saveSettings() {
    this.notificationService.success('Settings Saved', 'Dashboard preferences have been updated successfully.');
  }
}
