import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor() {
    // Migration: reset legacy dark theme preference to light theme by default
    if (!localStorage.getItem('djq_theme_v2')) {
      localStorage.setItem('djq_theme', 'light');
      localStorage.setItem('djq_theme_v2', 'true');
    }
    const savedTheme = localStorage.getItem('djq_theme') || 'light';
    this.themeSubject = new BehaviorSubject(savedTheme);
    this.theme$ = this.themeSubject.asObservable();
    this.applyTheme(savedTheme);
  }

  get currentTheme() {
    return this.themeSubject.value;
  }

  toggleTheme() {
    const nextTheme = this.themeSubject.value === 'dark' ? 'light' : 'dark';
    this.themeSubject.next(nextTheme);
    localStorage.setItem('djq_theme', nextTheme);
    this.applyTheme(nextTheme);
  }

  setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') return;
    this.themeSubject.next(theme);
    localStorage.setItem('djq_theme', theme);
    this.applyTheme(theme);
  }

  applyTheme(theme) {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    }
  }
}
