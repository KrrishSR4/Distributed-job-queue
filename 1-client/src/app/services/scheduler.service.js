import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { INITIAL_SCHEDULER_JOBS } from '../models/mock-data.js';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {
  constructor() {
    this.schedulerJobsSubject = new BehaviorSubject(INITIAL_SCHEDULER_JOBS);
    this.schedulerJobs$ = this.schedulerJobsSubject.asObservable();
  }

  toggleJobStatus(jobId) {
    const updated = this.schedulerJobsSubject.value.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: job.status === 'enabled' ? 'disabled' : 'enabled'
        };
      }
      return job;
    });
    this.schedulerJobsSubject.next(updated);
  }

  triggerNow(jobId) {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const updated = this.schedulerJobsSubject.value.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          lastRun: now
        };
      }
      return job;
    });
    this.schedulerJobsSubject.next(updated);
  }
}
