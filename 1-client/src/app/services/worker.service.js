import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { INITIAL_WORKERS } from '../models/mock-data.js';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  constructor() {
    this.workersSubject = new BehaviorSubject(INITIAL_WORKERS);
    this.workers$ = this.workersSubject.asObservable();
  }

  restartWorker(workerId) {
    const updated = this.workersSubject.value.map(w => {
      if (w.id === workerId) {
        return {
          ...w,
          status: 'idle',
          currentJob: '-',
          cpu: 10,
          memory: 25,
          concurrency: '0/20'
        };
      }
      return w;
    });
    this.workersSubject.next(updated);
  }

  toggleWorkerStatus(workerId) {
    const updated = this.workersSubject.value.map(w => {
      if (w.id === workerId) {
        const nextStatus = w.status === 'busy' || w.status === 'active' ? 'idle' : 'active';
        return {
          ...w,
          status: nextStatus,
          currentJob: nextStatus === 'idle' ? '-' : w.currentJob
        };
      }
      return w;
    });
    this.workersSubject.next(updated);
  }
}
