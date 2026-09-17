import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import mermaid from 'mermaid';
import panzoom from 'panzoom';

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    primaryColor: '#f8fafc',
    primaryTextColor: '#0f172a',
    primaryBorderColor: '#cbd5e1',
    lineColor: '#64748b',
    secondaryColor: '#f1f5f9',
    tertiaryColor: '#e2e8f0',
    background: '#ffffff',
  }
});

let counter = 0;

@Component({
  selector: 'app-diagram-viewer',
  standalone: true,
  template: `
    <div class="relative w-full border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm my-8 group" [style.height.px]="height">
      
      <!-- Toolbar -->
      <div class="absolute top-4 left-4 z-10 flex items-center gap-1 bg-white/90 backdrop-blur border border-slate-200 rounded-lg p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button (click)="zoomIn()" class="p-1.5 hover:bg-slate-100 text-slate-600 rounded transition-colors" title="Zoom In">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        </button>
        <button (click)="zoomOut()" class="p-1.5 hover:bg-slate-100 text-slate-600 rounded transition-colors" title="Zoom Out">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>
        </button>
        <div class="w-px h-4 bg-slate-200 mx-1"></div>
        <button (click)="resetZoom()" class="px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded transition-colors" title="Reset">
          Reset
        </button>
      </div>
      
      <!-- Instruction Overlay -->
      <div class="absolute top-4 right-4 z-10 pointer-events-none text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-white/90 backdrop-blur px-2 py-1 rounded border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Scroll to zoom · Drag to pan
      </div>

      <!-- Diagram Container -->
      <div #container class="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center p-4">
        <!-- SVG injected here -->
      </div>
    </div>
  `
})
export class DiagramViewerComponent {
  @Input() definition = '';
  @Input() height = 500;
  @ViewChild('container') containerRef;

  pzInstance = null;
  diagramId = `mermaid-diagram-${++counter}`;

  ngAfterViewInit() {
    this.renderDiagram();
  }

  ngOnChanges(changes) {
    if (changes.definition && !changes.definition.firstChange) {
      this.renderDiagram();
    }
  }

  async renderDiagram() {
    if (!this.definition || !this.containerRef) return;
    
    try {
      const container = this.containerRef.nativeElement;
      
      if (this.pzInstance) {
        this.pzInstance.dispose();
        this.pzInstance = null;
      }
      
      container.innerHTML = '';
      
      const { svg } = await mermaid.render(this.diagramId, this.definition.trim());
      container.innerHTML = svg;
      
      const svgElement = container.querySelector('svg');
      if (svgElement) {
        svgElement.style.maxWidth = '100%';
        svgElement.style.maxHeight = '100%';

        this.pzInstance = panzoom(svgElement, {
          maxZoom: 5,
          minZoom: 0.1,
          bounds: true,
          boundsPadding: 0.1,
          smoothScroll: false
        });
      }
    } catch (err) {
      console.error('Mermaid render error:', err);
      if (this.containerRef) {
        this.containerRef.nativeElement.innerHTML = `<div class="text-red-500 text-sm p-4 font-mono bg-red-50 w-full h-full flex flex-col items-center justify-center"><b>Error rendering diagram:</b><br>${err.message}</div>`;
      }
    }
  }

  zoomIn() {
    if (this.pzInstance && this.containerRef) {
      const container = this.containerRef.nativeElement;
      const rect = container.getBoundingClientRect();
      this.pzInstance.smoothZoom(rect.width / 2, rect.height / 2, 1.5);
    }
  }

  zoomOut() {
    if (this.pzInstance && this.containerRef) {
      const container = this.containerRef.nativeElement;
      const rect = container.getBoundingClientRect();
      this.pzInstance.smoothZoom(rect.width / 2, rect.height / 2, 0.666);
    }
  }

  resetZoom() {
    if (this.pzInstance && this.containerRef) {
      const svgElement = this.containerRef.nativeElement.querySelector('svg');
      if (svgElement) {
        // Find optimal scale to fit container
        const container = this.containerRef.nativeElement;
        const rect = container.getBoundingClientRect();
        const svgRect = svgElement.getBoundingClientRect();
        
        this.pzInstance.moveTo(0, 0);
        this.pzInstance.zoomAbs(0, 0, 1);
      }
    }
  }
}
