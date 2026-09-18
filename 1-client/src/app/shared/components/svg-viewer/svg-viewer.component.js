import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-svg-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-[500px] border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/50 group select-none">
      
      <!-- Toolbar -->
      <div class="absolute top-4 right-4 z-10 flex items-center gap-1.5 p-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
        <button (click)="zoomIn()" class="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors" title="Zoom In">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button (click)="zoomOut()" class="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors" title="Zoom Out">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>
        <div class="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
        <button (click)="reset()" class="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors" title="Reset View">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <!-- Viewport -->
      <div #viewport 
           class="w-full h-full cursor-grab active:cursor-grabbing origin-center"
           (mousedown)="onMouseDown($event)"
           (mousemove)="onMouseMove($event)"
           (mouseup)="onMouseUp()"
           (mouseleave)="onMouseUp()"
           (wheel)="onWheel($event)"
           [style.transform]="getTransform()">
        <div class="w-full h-full flex items-center justify-center min-w-max min-h-max p-12">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
})
export class SvgViewerComponent {
  @ViewChild('viewport') viewportRef;

  scale = 1;
  translateX = 0;
  translateY = 0;

  isDragging = false;
  startX = 0;
  startY = 0;
  lastTranslateX = 0;
  lastTranslateY = 0;

  getTransform() {
    return `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
  }

  onMouseDown(event) {
    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.lastTranslateX = this.translateX;
    this.lastTranslateY = this.translateY;
  }

  onMouseMove(event) {
    if (!this.isDragging) return;
    
    event.preventDefault();
    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;
    
    this.translateX = this.lastTranslateX + dx;
    this.translateY = this.lastTranslateY + dy;
  }

  onMouseUp() {
    this.isDragging = false;
  }

  onWheel(event) {
    event.preventDefault();
    
    const zoomSensitivity = 0.001;
    const delta = -event.deltaY * zoomSensitivity;
    
    let newScale = this.scale + delta;
    newScale = Math.max(0.1, Math.min(newScale, 5));
    
    this.scale = newScale;
  }

  zoomIn() {
    this.scale = Math.min(this.scale + 0.2, 5);
  }

  zoomOut() {
    this.scale = Math.max(this.scale - 0.2, 0.1);
  }

  reset() {
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
  }
}
