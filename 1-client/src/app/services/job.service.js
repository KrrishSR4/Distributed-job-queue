import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { INITIAL_JOBS } from '../models/mock-data.js';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  constructor() {
    this.jobsSubject = new BehaviorSubject(INITIAL_JOBS);
    this.jobs$ = this.jobsSubject.asObservable();
    this.selectedJobSubject = new BehaviorSubject(null);
    this.selectedJob$ = this.selectedJobSubject.asObservable();

    this.stats$ = this.jobs$.pipe(
      map(jobs => {
        const total = jobs.length;
        const queued = jobs.filter(j => j.status === 'queued').length;
        const running = jobs.filter(j => j.status === 'running').length;
        const completed = jobs.filter(j => j.status === 'completed').length;
        const failed = jobs.filter(j => j.status === 'failed').length;
        return { total, queued, running, completed, failed };
      })
    );
  }

  get jobs() {
    return this.jobsSubject.value;
  }

  selectJob(job) {
    this.selectedJobSubject.next(job);
  }

  clearSelectedJob() {
    this.selectedJobSubject.next(null);
  }

  retryJob(jobId) {
    const jobs = this.jobsSubject.value.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: 'queued',
          worker: '-',
          duration: '-',
          attempts: job.attempts + 1,
          logs: [
            ...job.logs,
            `[${new Date().toISOString().substring(11, 19)}] Manual retry triggered. Status changed to QUEUED.`
          ]
        };
      }
      return job;
    });
    this.jobsSubject.next(jobs);

    if (this.selectedJobSubject.value?.id === jobId) {
      const updated = jobs.find(j => j.id === jobId);
      this.selectedJobSubject.next(updated);
    }
  }

  cancelJob(jobId) {
    const jobs = this.jobsSubject.value.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: 'failed',
          error: 'Cancelled by user from dashboard interface',
          logs: [
            ...job.logs,
            `[${new Date().toISOString().substring(11, 19)}] Job execution cancelled by user.`
          ]
        };
      }
      return job;
    });
    this.jobsSubject.next(jobs);

    if (this.selectedJobSubject.value?.id === jobId) {
      const updated = jobs.find(j => j.id === jobId);
      this.selectedJobSubject.next(updated);
    }
  }

  enqueueMockJob(type = 'ProcessStripeInvoice', queue = 'billing-webhooks', priority = 'high', customPayload = null, retryLimit = 3) {
    const newId = 'job-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newJob = {
      id: newId,
      type: type || 'SendWelcomeEmail',
      queue: queue || 'default',
      status: 'queued',
      priority: priority || 'normal',
      createdAt: now,
      duration: '-',
      worker: '-',
      attempts: 0,
      maxRetries: Number(retryLimit) || 3,
      payload: customPayload || { user_id: 'usr_' + Math.floor(Math.random() * 10000), action: 'manual_submit' },
      logs: [`[${now.substring(11)}] Enqueued via Dashboard Interface`]
    };
    this.jobsSubject.next([newJob, ...this.jobsSubject.value]);
    return newJob;
  }
}
