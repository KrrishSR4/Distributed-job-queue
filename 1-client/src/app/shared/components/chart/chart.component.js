import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';
import { ThemeService } from '../../../services/theme.service.js';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full h-full relative min-h-[220px]">
      <div #chartContainer class="w-full h-full min-h-[220px]"></div>
    </div>
  `
})
export class ChartComponent {
  @Input() options = {};
  @Input() height = '250px';
  @ViewChild('chartContainer') chartContainer;

  themeService = inject(ThemeService);
  el = inject(ElementRef);

  constructor() {
    this.chartInstance = null;
    this.themeSubscription = null;
    this.resizeObserver = null;
  }

  ngAfterViewInit() {
    this.initChart();
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      if (this.chartInstance) {
        this.updateOptionsWithTheme(theme);
      }
    });

    if (typeof ResizeObserver !== 'undefined' && this.chartContainer) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.chartInstance) {
          this.chartInstance.resize();
        }
      });
      this.resizeObserver.observe(this.chartContainer.nativeElement);
    }
  }

  ngOnChanges(changes) {
    const isFirst = changes.options && (typeof changes.options.isFirstChange === 'function' ? changes.options.isFirstChange() : changes.options.firstChange);
    if (changes.options && !isFirst && this.chartInstance) {
      this.updateOptionsWithTheme(this.themeService.currentTheme);
    }
  }

  initChart() {
    if (!this.chartContainer) return;
    const container = this.chartContainer.nativeElement;
    this.chartInstance = echarts.init(container);
    this.updateOptionsWithTheme(this.themeService.currentTheme);
  }

  updateOptionsWithTheme(theme) {
    if (!this.chartInstance || !this.options) return;

    const isDark = theme === 'dark';
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const borderColor = isDark ? '#334155' : '#e2e8f0';
    const tooltipBg = isDark ? '#1e293b' : '#ffffff';
    const tooltipText = isDark ? '#f8fafc' : '#0f172a';

    const baseThemeConfig = {
      textStyle: {
        fontFamily: 'Inter, sans-serif',
        color: textColor
      },
      tooltip: {
        backgroundColor: tooltipBg,
        borderColor: borderColor,
        textStyle: { color: tooltipText }
      },
      grid: {
        top: 24,
        right: 16,
        bottom: 24,
        left: 40,
        containLabel: true
      }
    };

    const mergedOptions = {
      ...baseThemeConfig,
      ...this.options,
      xAxis: Array.isArray(this.options.xAxis)
        ? this.options.xAxis.map(x => ({ ...x, axisLine: { lineStyle: { color: borderColor } }, axisLabel: { color: textColor } }))
        : (this.options.xAxis ? { ...this.options.xAxis, axisLine: { lineStyle: { color: borderColor } }, axisLabel: { color: textColor } } : undefined),
      yAxis: Array.isArray(this.options.yAxis)
        ? this.options.yAxis.map(y => ({ ...y, splitLine: { lineStyle: { color: borderColor, type: 'dashed' } }, axisLabel: { color: textColor } }))
        : (this.options.yAxis ? { ...this.options.yAxis, splitLine: { lineStyle: { color: borderColor, type: 'dashed' } }, axisLabel: { color: textColor } } : undefined)
    };

    this.chartInstance.setOption(mergedOptions, true);
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    if (this.resizeObserver && this.chartContainer) {
      this.resizeObserver.disconnect();
    }
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  }
}
