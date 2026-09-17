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
    <div class="space-y-8 animate-in fade-in duration-500">
      
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">System Overview</h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Real-time processing throughput and cluster health metrics</p>
        </div>

        <div class="flex items-center gap-3 font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
          <span class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Cluster: <span class="font-semibold text-zinc-800 dark:text-zinc-200">prod-us-east-1</span>
          </span>
          <span class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
            Region: <span class="font-semibold text-zinc-800 dark:text-zinc-200">US-East</span>
          </span>
        </div>
      </div>

      <div *ngIf="(jobService.stats$ | async) as stats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <app-stat-card title="Total Jobs" [value]="stats.total" subtitle="Total tasks processed" trend="+12.4% this hr" trendType="up">
          <svg icon class="w-4 h-4 text-zinc-700 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 01-2-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </app-stat-card>

        <app-stat-card title="Queued Jobs" [value]="stats.queued" subtitle="Waiting in queue buffer" variant="info">
          <svg icon class="w-4 h-4 text-zinc-700 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </app-stat-card>

        <app-stat-card title="Running Jobs" [value]="stats.running" subtitle="Active execution on workers" variant="warning">
          <svg icon class="w-4 h-4 text-zinc-700 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </app-stat-card>

        <app-stat-card title="Failed Jobs" [value]="stats.failed" subtitle="Requires attention in DLQ" variant="danger" trend="-2.4%" trendType="down">
          <svg icon class="w-4 h-4 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </app-stat-card>

      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="lg:col-span-2 bg-white dark:bg-[#121214] border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover-lift flex flex-col transition-all">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-base font-display font-semibold text-zinc-900 dark:text-zinc-100">Processing Throughput</h3>
              <p class="text-[13px] text-zinc-500 dark:text-zinc-400 mt-1">Processed vs Queued tasks per minute</p>
            </div>
            <span class="px-3 py-1 rounded-md text-xs font-mono bg-zinc-100 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 font-medium">
              412 j/min avg
            </span>
          </div>
          <div class="flex-1 min-h-[280px]">
            <app-chart [options]="throughputChartOptions"></app-chart>
          </div>
        </div>

        <div class="bg-white dark:bg-[#121214] border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover-lift flex flex-col transition-all">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-base font-display font-semibold text-zinc-900 dark:text-zinc-100">Job Status</h3>
              <p class="text-[13px] text-zinc-500 dark:text-zinc-400 mt-1">Current execution distribution</p>
            </div>
          </div>
          <div class="flex-1 min-h-[280px] relative">
            <app-chart [options]="distributionChartOptions"></app-chart>
          </div>
        </div>

      </div>

      <div class="bg-white dark:bg-[#121214] border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover-lift transition-all space-y-6">
        
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 class="text-base font-display font-semibold text-zinc-900 dark:text-zinc-100">Recent Executions</h3>
            <p class="text-[13px] text-zinc-500 dark:text-zinc-400 mt-1">Live feed of processed background tasks</p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="relative">
              <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" 
                     [(ngModel)]="recentSearch" 
                     placeholder="Search ID or type..." 
                     class="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-[13px] text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors w-64">
            </div>
            
            <select [(ngModel)]="recentStatusFilter" 
                    class="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-[13px] text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors cursor-pointer appearance-none">
              <option value="ALL">All Statuses</option>
              <option value="queued">Queued</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>

            <a routerLink="/jobs" class="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors ml-2 flex items-center gap-1">
              View All 
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </a>
          </div>
        </div>

        <div class="border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl overflow-hidden">
          <app-data-table [columns]="recentJobsColumns" [showPagination]="false">
            <tr *ngFor="let job of filteredRecentJobs" 
                (click)="jobService.selectJob(job)"
                class="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors border-b border-zinc-100 dark:border-zinc-800/60 last:border-0 group">
              <td class="px-5 py-3.5 font-mono text-[13px] font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{ job.id }}</td>
              <td class="px-5 py-3.5 text-[13px] font-medium text-zinc-700 dark:text-zinc-300">{{ job.type }}</td>
              <td class="px-5 py-3.5">
                <app-status-badge [status]="job.priority"></app-status-badge>
              </td>
              <td class="px-5 py-3.5">
                <app-status-badge [status]="job.status"></app-status-badge>
              </td>
              <td class="px-5 py-3.5 font-mono text-zinc-500 dark:text-zinc-400 text-[12px]">{{ job.worker }}</td>
              <td class="px-5 py-3.5 font-mono text-zinc-500 dark:text-zinc-400 text-[12px] whitespace-nowrap">{{ job.createdAt }}</td>
              <td class="px-5 py-3.5 font-mono text-zinc-500 dark:text-zinc-400 text-[12px]">{{ job.duration }}</td>
              <td class="px-5 py-3.5 text-right">
                <button (click)="$event.stopPropagation(); jobService.selectJob(job)" 
                        class="px-3 py-1.5 text-[12px] bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-medium rounded-lg transition-colors opacity-0 group-hover:opacity-100 shadow-sm">
                  Inspect
                </button>
              </td>
            </tr>
          </app-data-table>
        </div>

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
      color: ['#09090b', '#71717a'],
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#e4e4e7', textStyle: { color: '#09090b', fontFamily: 'Inter' } },
      legend: { data: ['Processed', 'Queued'], textStyle: { color: '#71717a', fontFamily: 'Inter' }, top: 0 },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#e4e4e7' } },
        axisLabel: { color: '#71717a', fontFamily: 'JetBrains Mono' },
        data: ['04:00', '04:05', '04:10', '04:15', '04:20', '04:25', '04:30', '04:35', '04:40']
      },
      yAxis: { 
        type: 'value',
        splitLine: { lineStyle: { color: '#f4f4f5', type: 'dashed' } },
        axisLabel: { color: '#71717a', fontFamily: 'JetBrains Mono' }
      },
      series: [
        {
          name: 'Processed',
          type: 'line',
          smooth: true,
          showSymbol: false,
          areaStyle: { color: 'rgba(9, 9, 11, 0.05)' },
          lineStyle: { width: 2 },
          data: [320, 380, 410, 390, 480, 520, 460, 430, 490]
        },
        {
          name: 'Queued',
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, type: 'dashed' },
          data: [80, 110, 95, 140, 120, 105, 90, 130, 115]
        }
      ]
    };

    this.distributionChartOptions = {
      color: ['#10b981', '#3b82f6', '#a1a1aa', '#ef4444'],
      tooltip: { trigger: 'item', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#e4e4e7', textStyle: { color: '#09090b', fontFamily: 'Inter' } },
      legend: { bottom: '0', textStyle: { color: '#71717a', fontSize: 11, fontFamily: 'Inter' } },
      series: [
        {
          name: 'Job Status',
          type: 'pie',
          radius: ['55%', '75%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 6, borderColor: '#ffffff', borderWidth: 2 },
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
