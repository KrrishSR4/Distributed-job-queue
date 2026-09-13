import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component.js';
import { ChartComponent } from '../../shared/components/chart/chart.component.js';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, StatCardComponent, ChartComponent],
  template: `
    <div class="space-y-6">
      
      <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div>
          <h2 class="text-base font-bold text-slate-900 dark:text-slate-100">Telemetry & Performance Analytics</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">Historical performance metrics, queue wait latencies, and worker efficiency</p>
        </div>

        <div class="flex items-center bg-slate-50 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono">
          <button *ngFor="let range of ranges" 
                  (click)="selectedRange = range"
                  [ngClass]="selectedRange === range ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'"
                  class="px-3 py-1 rounded transition-colors uppercase">
            {{ range }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <app-stat-card title="Avg Processing Time" value="340 ms" subtitle="p50 latency benchmark" variant="info" trend="-12ms" trendType="up">
          <svg icon class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </app-stat-card>

        <app-stat-card title="Queue Latency (p99)" value="1.82 s" subtitle="Tail wait time in queue" variant="warning" trend="+0.04s" trendType="down">
          <svg icon class="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </app-stat-card>

        <app-stat-card title="Success Rate" value="98.4 %" subtitle="Overall cluster reliability" variant="success" trend="+0.2%" trendType="up">
          <svg icon class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </app-stat-card>

        <app-stat-card title="Failure Rate" value="1.6 %" subtitle="Failed task percentage" variant="danger" trend="-0.2%" trendType="up">
          <svg icon class="w-4 h-4 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </app-stat-card>

      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100">Job Throughput</h3>
            <span class="text-xs text-slate-400 font-mono">Jobs / Minute</span>
          </div>
          <div class="min-h-[280px]">
            <app-chart [options]="throughputOptions"></app-chart>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100">Queue Latency Distribution (p50, p95, p99)</h3>
            <span class="text-xs text-slate-400 font-mono">Milliseconds</span>
          </div>
          <div class="min-h-[280px]">
            <app-chart [options]="latencyOptions"></app-chart>
          </div>
        </div>

      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3 lg:col-span-2">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100">Queue Volume Breakdown</h3>
            <span class="text-xs text-slate-400 font-mono">By Queue Name</span>
          </div>
          <div class="min-h-[260px]">
            <app-chart [options]="queueBarOptions"></app-chart>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100">Worker Cluster Utilization</h3>
            <span class="text-xs text-slate-400 font-mono">Average CPU Load</span>
          </div>
          <div class="min-h-[260px]">
            <app-chart [options]="workerGaugeOptions"></app-chart>
          </div>
        </div>

      </div>

    </div>
  `
})
export class AnalyticsComponent {
  ranges = ['1h', '24h', '7d', '30d'];
  selectedRange = '24h';

  constructor() {
    this.throughputOptions = {
      color: ['#2563eb', '#10b981', '#ef4444'],
      tooltip: { trigger: 'axis' },
      legend: { data: ['Total Executed', 'Successful', 'Failed'], textStyle: { color: '#64748b' }, top: 0 },
      xAxis: {
        type: 'category',
        data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
      },
      yAxis: { type: 'value' },
      series: [
        { name: 'Total Executed', type: 'line', smooth: true, data: [820, 932, 901, 934, 1290, 1330, 1320, 1100] },
        { name: 'Successful', type: 'line', smooth: true, data: [810, 920, 890, 925, 1270, 1315, 1300, 1085] },
        { name: 'Failed', type: 'line', smooth: true, data: [10, 12, 11, 9, 20, 15, 20, 15] }
      ]
    };

    this.latencyOptions = {
      color: ['#8b5cf6', '#f59e0b', '#ef4444'],
      tooltip: { trigger: 'axis' },
      legend: { data: ['p50 (Median)', 'p95', 'p99 (Tail)'], textStyle: { color: '#64748b' }, top: 0 },
      xAxis: {
        type: 'category',
        data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
      },
      yAxis: { type: 'value', axisLabel: { formatter: '{value} ms' } },
      series: [
        { name: 'p50 (Median)', type: 'line', smooth: true, data: [210, 240, 220, 260, 340, 310, 290, 280] },
        { name: 'p95', type: 'line', smooth: true, data: [620, 680, 640, 710, 980, 910, 850, 820] },
        { name: 'p99 (Tail)', type: 'line', smooth: true, data: [1200, 1350, 1280, 1420, 1820, 1710, 1600, 1540] }
      ]
    };

    this.queueBarOptions = {
      color: ['#2563eb'],
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['default', 'high-priority', 'billing-webhooks', 'video-encoding', 'email-notifications'] },
      yAxis: { type: 'value' },
      series: [
        {
          name: 'Processed Jobs',
          type: 'bar',
          barWidth: '40%',
          itemStyle: { borderRadius: [4, 4, 0, 0] },
          data: [14200, 9800, 7400, 1200, 8900]
        }
      ]
    };

    this.workerGaugeOptions = {
      tooltip: { formatter: '{b} : {c}%' },
      series: [
        {
          name: 'Cluster Load',
          type: 'gauge',
          progress: { show: true, width: 8 },
          axisLine: { lineStyle: { width: 8 } },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          pointer: { show: true, length: '60%', width: 4 },
          title: { offsetCenter: [0, '80%'], textStyle: { color: '#64748b', fontSize: 11 } },
          detail: { valueAnimation: true, offsetCenter: [0, '40%'], textStyle: { color: '#2563eb', fontSize: 20, fontWeight: 'bold' }, formatter: '{value}%' },
          data: [{ value: 68, name: 'AVG CPU LOAD' }]
        }
      ]
    };
  }
}
