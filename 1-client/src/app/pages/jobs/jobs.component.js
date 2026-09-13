import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component.js';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component.js';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component.js';
import { JobService } from '../../services/job.service.js';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    StatusBadgeComponent, 
    DataTableComponent, 
    EmptyStateComponent
  ],
  template: `
    <div class="space-y-4">
      
      <!-- Toolbar: Search & Filters -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        
        <div class="relative flex-1 max-w-md">
          <input type="text" 
                 [(ngModel)]="searchQuery"
                 (ngModelChange)="onFilterChange()"
                 placeholder="Filter by Job ID, Type, Worker, or Queue..." 
                 class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 pl-9 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors">
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          
          <select [(ngModel)]="statusFilter" (ngModelChange)="onFilterChange()"
                  class="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500">
            <option value="ALL">All Statuses</option>
            <option value="queued">Queued</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>

          <select [(ngModel)]="priorityFilter" (ngModelChange)="onFilterChange()"
                  class="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500">
            <option value="ALL">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>

          <select [(ngModel)]="queueFilter" (ngModelChange)="onFilterChange()"
                  class="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500">
            <option value="ALL">All Queues</option>
            <option value="default">default</option>
            <option value="high-priority">high-priority</option>
            <option value="billing-webhooks">billing-webhooks</option>
            <option value="video-encoding">video-encoding</option>
            <option value="email-notifications">email-notifications</option>
          </select>

          <button *ngIf="searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL' || queueFilter !== 'ALL'"
                  (click)="resetFilters()"
                  class="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors">
            Reset
          </button>
        </div>

      </div>

      <!-- Jobs Table -->
      <app-data-table [columns]="columns" 
                      [totalItems]="filteredJobs.length" 
                      [pageSize]="pageSize" 
                      [currentPage]="currentPage" 
                      (pageChange)="currentPage = $event">
        
        <tr *ngFor="let job of paginatedJobs" 
            class="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors border-b border-slate-200/60 dark:border-slate-800/60">
          
          <td class="px-4 py-3 font-mono font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer" 
              (click)="jobService.selectJob(job)">
            {{ job.id }}
          </td>

          <td class="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
            <div class="flex flex-col">
              <span class="font-semibold">{{ job.type }}</span>
              <span class="text-[10px] font-mono text-slate-400">Attempts: {{ job.attempts }}</span>
            </div>
          </td>

          <td class="px-4 py-3 font-mono text-slate-600 dark:text-slate-400 text-xs">
            <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">{{ job.queue }}</span>
          </td>

          <td class="px-4 py-3">
            <app-status-badge [status]="job.status"></app-status-badge>
          </td>

          <td class="px-4 py-3">
            <app-status-badge [status]="job.priority"></app-status-badge>
          </td>

          <td class="px-4 py-3 font-mono text-slate-600 dark:text-slate-400 text-xs">
            {{ job.duration }}
          </td>

          <td class="px-4 py-3 font-mono text-slate-600 dark:text-slate-400 text-xs whitespace-nowrap">
            {{ job.worker }}
          </td>

          <td class="px-4 py-3 font-mono text-slate-400 text-xs whitespace-nowrap">
            {{ job.createdAt }}
          </td>

          <td class="px-4 py-3 text-right">
            <div class="flex items-center justify-end gap-1.5">
              <button (click)="jobService.selectJob(job)" 
                      title="Inspect Job"
                      class="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-medium rounded-md transition-colors">
                Inspect
              </button>

              <button *ngIf="job.status === 'failed' || job.status === 'completed'" 
                      (click)="jobService.retryJob(job.id)"
                      title="Retry Job"
                      class="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 text-blue-600 dark:text-blue-400 font-medium rounded-md transition-colors">
                Retry
              </button>
            </div>
          </td>

        </tr>

      </app-data-table>

      <app-empty-state *ngIf="filteredJobs.length === 0" 
                       title="No matching jobs found" 
                       description="Try broadening your search query or resetting active filters."
                       actionText="Reset Filters"
                       (actionClicked)="resetFilters()">
      </app-empty-state>

    </div>
  `
})
export class JobsComponent {
  columns = [
    { header: 'Job ID' },
    { header: 'Task Type' },
    { header: 'Queue' },
    { header: 'Status' },
    { header: 'Priority' },
    { header: 'Duration' },
    { header: 'Worker' },
    { header: 'Created At' },
    { header: 'Actions' }
  ];

  searchQuery = '';
  statusFilter = 'ALL';
  priorityFilter = 'ALL';
  queueFilter = 'ALL';

  pageSize = 10;
  currentPage = 1;
  filteredJobs = [];

  jobService = inject(JobService);

  constructor() {
    this.jobService.jobs$.subscribe(jobs => {
      this.allJobs = jobs;
      this.applyFilters();
    });
  }

  onFilterChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    if (!this.allJobs) return;
    const query = (this.searchQuery || '').toLowerCase();

    this.filteredJobs = this.allJobs.filter(job => {
      const matchesSearch = !query || 
        job.id.toLowerCase().includes(query) ||
        job.type.toLowerCase().includes(query) ||
        job.queue.toLowerCase().includes(query) ||
        job.worker.toLowerCase().includes(query);

      const matchesStatus = this.statusFilter === 'ALL' || job.status === this.statusFilter;
      const matchesPriority = this.priorityFilter === 'ALL' || job.priority === this.priorityFilter;
      const matchesQueue = this.queueFilter === 'ALL' || job.queue === this.queueFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesQueue;
    });
  }

  get paginatedJobs() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredJobs.slice(start, start + this.pageSize);
  }

  resetFilters() {
    this.searchQuery = '';
    this.statusFilter = 'ALL';
    this.priorityFilter = 'ALL';
    this.queueFilter = 'ALL';
    this.currentPage = 1;
    this.applyFilters();
  }
}
