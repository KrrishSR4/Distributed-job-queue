import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component.js';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component.js';
import { ChartComponent } from '../../shared/components/chart/chart.component.js';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component.js';
import { JobService } from '../../services/job.service.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    RouterModule, 
    StatCardComponent, 
    StatusBadgeComponent, 
    ChartComponent, 
    DataTableComponent
  ],
  template: `
    <div class="space-y-6">
      
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Overview</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real-time processing throughput and cluster health metrics</p>
        </div>

        <div class="flex items-center gap-2 font-mono text-xs text-slate-500">
          <span class="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            Cluster: <span class="font-semibold text-slate-800 dark:text-slate-200">prod-us-east-1</span>
          </span>
          <span class="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            Region: <span class="font-semibold text-slate-800 dark:text-slate-200">US-East (N. Virginia)</span>
          </span>
        </div>
      </div>

      <div *ngIf="(jobService.stats$ | async) as stats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <app-stat-card title="Total Jobs" [value]="stats.total" subtitle="Total tasks processed in queue" trend="+12.4% this hr" trendType="up">
          <svg icon class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 01-2-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </app-stat-card>

        <app-stat-card title="Queued Jobs" [value]="stats.queued" subtitle="Waiting in queue buffer" variant="info">
          <svg icon class="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </app-stat-card>

        <app-stat-card title="Running Jobs" [value]="stats.running" subtitle="Active execution on workers" variant="warning">
          <svg icon class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </app-stat-card>

        <app-stat-card title="Failed Jobs" [value]="stats.failed" subtitle="Requires attention in DLQ" variant="danger" trend="-2.4%" trendType="down">
          <svg icon class="w-4 h-4 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </app-stat-card>

      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100">Job Processing Throughput</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Processed vs Queued tasks per minute</p>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-mono bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-500/20 font-medium">
              412 j/min avg
            </span>
          </div>
          <div class="flex-1 min-h-[260px]">
            <app-chart [options]="throughputChartOptions"></app-chart>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100">Job Status</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Current execution status distribution</p>
            </div>
          </div>
          <div class="flex-1 min-h-[260px] relative">
            <app-chart [options]="distributionChartOptions"></app-chart>
          </div>
        </div>

      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100">Recent Jobs</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Live feed of processed and queued background tasks</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <input type="text" 
                   [(ngModel)]="recentSearch" 
                   placeholder="Search job ID or type..." 
                   class="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500">
            
            <select [(ngModel)]="recentStatusFilter" 
                    class="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500">
              <option value="ALL">All Statuses</option>
              <option value="queued">Queued</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>

            <a routerLink="/jobs" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">View All &rarr;</a>
          </div>
        </div>

        <app-data-table [columns]="recentJobsColumns" [showPagination]="false">
          <tr *ngFor="let job of filteredRecentJobs" 
              (click)="jobService.selectJob(job)"
              class="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 cursor-pointer transition-colors border-b border-slate-200/60 dark:border-slate-800/60">
            <td class="px-4 py-2.5 font-mono font-semibold text-blue-600 dark:text-blue-400">{{ job.id }}</td>
            <td class="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200">{{ job.type }}</td>
            <td class="px-4 py-2.5">
              <app-status-badge [status]="job.priority"></app-status-badge>
            </td>
            <td class="px-4 py-2.5">
              <app-status-badge [status]="job.status"></app-status-badge>
            </td>
            <td class="px-4 py-2.5 font-mono text-slate-600 dark:text-slate-400 text-xs">{{ job.worker }}</td>
            <td class="px-4 py-2.5 font-mono text-slate-500 text-[11px] whitespace-nowrap">{{ job.createdAt }}</td>
            <td class="px-4 py-2.5 font-mono text-slate-600 dark:text-slate-400 text-xs">{{ job.duration }}</td>
            <td class="px-4 py-2.5 text-right">
              <button (click)="$event.stopPropagation(); jobService.selectJob(job)" 
                      class="px-2 py-1 text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-medium rounded-md transition-colors">
                Inspect
              </button>
            </td>
          </tr>
        </app-data-table>

      </div>

    </div>
  `
})
export class DashboardComponent {
  recentJobsColumns = [
    { header: 'Job ID' },
    { header: 'Job Type' },
    { header: 'Priority' },
    { header: 'Status' },
    { header: 'Worker' },
    { header: 'Created' },
    { header: 'Duration' },
    { header: 'Actions' }
  ];

  recentSearch = '';
  recentStatusFilter = 'ALL';

  jobService = inject(JobService);

  constructor() {
    this.throughputChartOptions = {
      color: ['#2563eb', '#10b981'],
      tooltip: { trigger: 'axis' },
      legend: { data: ['Processed', 'Queued'], textStyle: { color: '#64748b' }, top: 0 },
      xAxis: {
        type: 'category',
        data: ['04:00', '04:05', '04:10', '04:15', '04:20', '04:25', '04:30', '04:35', '04:40']
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: 'Processed',
          type: 'line',
          smooth: true,
          areaStyle: { color: 'rgba(37, 99, 235, 0.08)' },
          data: [320, 380, 410, 390, 480, 520, 460, 430, 490]
        },
        {
          name: 'Queued',
          type: 'line',
          smooth: true,
          data: [80, 110, 95, 140, 120, 105, 90, 130, 115]
        }
      ]
    };

    this.distributionChartOptions = {
      color: ['#10b981', '#3b82f6', '#94a3b8', '#ef4444'],
      tooltip: { trigger: 'item' },
      legend: { bottom: '0', textStyle: { color: '#64748b', fontSize: 11 } },
      series: [
        {
          name: 'Job Status',
          type: 'pie',
          radius: ['50%', '75%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 4, borderColor: '#ffffff', borderWidth: 2 },
          label: { show: false },
          data: [
            { value: 4820, name: 'Completed' },
            { value: 310, name: 'Running' },
            { value: 128, name: 'Queued' },
            { value: 24, name: 'Failed' }
          ]
        }
      ]
    };
  }

  get filteredRecentJobs() {
    const jobs = this.jobService.jobs || [];
    const query = (this.recentSearch || '').toLowerCase();
    return jobs.filter(j => {
      const matchSearch = !query || j.id.toLowerCase().includes(query) || j.type.toLowerCase().includes(query);
      const matchStatus = this.recentStatusFilter === 'ALL' || j.status === this.recentStatusFilter;
      return matchSearch && matchStatus;
    }).slice(0, 6);
  }
}
