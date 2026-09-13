import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { INITIAL_DLQ_JOBS } from '../models/mock-data.js';
import { JobService } from './job.service.js';
import { NotificationService } from './notification.service.js';

@Injectable({
  providedIn: 'root'
})
export class DlqService {
  jobService = inject(JobService);
  notificationService = inject(NotificationService);

  constructor() {
    this.dlqJobsSubject = new BehaviorSubject(INITIAL_DLQ_JOBS);
    this.dlqJobs$ = this.dlqJobsSubject.asObservable();
  }

  get dlqJobs() {
    return this.dlqJobsSubject.value;
  }

  retryJob(dlqId) {
    const item = this.dlqJobsSubject.value.find(d => d.id === dlqId);
    if (item) {
      this.jobService.retryJob(item.jobId);
      const updated = this.dlqJobsSubject.value.filter(d => d.id !== dlqId);
      this.dlqJobsSubject.next(updated);
      this.notificationService.success('Job Retried', `Job ${item.jobId} moved from DLQ to Queued state.`);
    }
  }

  deleteJob(dlqId) {
    const item = this.dlqJobsSubject.value.find(d => d.id === dlqId);
    const updated = this.dlqJobsSubject.value.filter(d => d.id !== dlqId);
    this.dlqJobsSubject.next(updated);
    if (item) {
      this.notificationService.info('Job Deleted', `Job ${item.jobId} purged from Dead Letter Queue.`);
    }
  }

  retryAll() {
    const current = [...this.dlqJobsSubject.value];
    current.forEach(item => {
      this.jobService.retryJob(item.jobId);
    });
    this.dlqJobsSubject.next([]);
    this.notificationService.success('All Jobs Retried', `Re-queued ${current.length} failed jobs from DLQ.`);
  }

  purgeAll() {
    const count = this.dlqJobsSubject.value.length;
    this.dlqJobsSubject.next([]);
    this.notificationService.warning('DLQ Purged', `Permanently removed ${count} jobs from Dead Letter Queue.`);
  }
}
