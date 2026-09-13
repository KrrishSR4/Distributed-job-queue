import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor() {
    this.toastsSubject = new BehaviorSubject([]);
    this.toasts$ = this.toastsSubject.asObservable();
  }

  show(type, title, message, duration = 4000) {
    const id = 'toast-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const toast = { id, type, title, message };
    const current = this.toastsSubject.value;
    this.toastsSubject.next([...current, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  success(title, message) {
    this.show('success', title, message);
  }

  error(title, message) {
    this.show('error', title, message);
  }

  info(title, message) {
    this.show('info', title, message);
  }

  warning(title, message) {
    this.show('warning', title, message);
  }

  remove(id) {
    const filtered = this.toastsSubject.value.filter(t => t.id !== id);
    this.toastsSubject.next(filtered);
  }
}
