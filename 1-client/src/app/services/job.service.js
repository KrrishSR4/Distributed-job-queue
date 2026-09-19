import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { WebsocketService } from './websocket.service.js';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private wsService = inject(WebsocketService);
  private apiUrl = 'http://localhost:8080/api/v1/jobs';

  constructor() {
    this.jobsSubject = new BehaviorSubject([]);
    this.jobs$ = this.jobsSubject.asObservable();
    this.selectedJobSubject = new BehaviorSubject(null);
    this.selectedJob$ = this.selectedJobSubject.asObservable();

    this.stats$ = this.jobs$.pipe(
      map(jobs => {
        const total = jobs.length;
        const queued = jobs.filter(j => j.status === 'queued' || j.status === 'scheduled').length;
        const running = jobs.filter(j => j.status === 'processing').length;
        const completed = jobs.filter(j => j.status === 'completed').length;
        const failed = jobs.filter(j => j.status === 'failed' || j.status === 'cancelled').length;
        return { total, queued, running, completed, failed };
      })
    );

    this.fetchInitialJobs();
    this.setupWebSocket();
  }

  get jobs() {
    return this.jobsSubject.value;
  }

  async fetchInitialJobs() {
    try {
      const response = await fetch(`${this.apiUrl}?limit=100`);
      if (response.ok) {
        const data = await response.json();
        const apiJobs = data.data.jobs || [];
        // Map API jobs to frontend format if needed
        const mappedJobs = apiJobs.map(this.mapApiJob);
        this.jobsSubject.next(mappedJobs);
      }
    } catch (e) {
      console.error('Failed to fetch initial jobs', e);
    }
  }

  setupWebSocket() {
    // When websocket reconnects, fetch jobs again to recover any missed events
    this.wsService.connectionStatus$.subscribe(status => {
      if (status === 'connected') {
        this.fetchInitialJobs();
      }
    });

    this.wsService.events$.subscribe((event) => {
      this.handleWebSocketEvent(event);
    });
  }

  handleWebSocketEvent(event) {
    console.log('[JobService] WebSocket Event:', event);
    
    // Some events might be for new jobs not in our list
    if (event.type === 'job.queued' || event.type === 'job.scheduled') {
      // Just fetch the full list again to keep it simple, or insert a placeholder
      this.fetchInitialJobs();
      return;
    }

    const currentJobs = this.jobsSubject.value;
    const jobIndex = currentJobs.findIndex(j => j.id === event.job_id);
    
    if (jobIndex > -1) {
      const updatedJobs = [...currentJobs];
      const job = { ...updatedJobs[jobIndex] };
      
      // Update fields based on event type
      if (event.data?.status) {
        job.status = event.data.status;
      }

      if (event.type === 'job.processing') {
        job.status = 'processing';
        // could map worker if provided
      } else if (event.type === 'job.completed') {
        job.status = 'completed';
      } else if (event.type === 'job.failed' || event.type === 'job.dlq') {
        job.status = 'failed';
        job.error = event.data?.error || 'Unknown error';
      } else if (event.type === 'job.cancelled') {
        job.status = 'cancelled';
      }

      updatedJobs[jobIndex] = job;
      this.jobsSubject.next(updatedJobs);

      // Update selected job if it's the one being viewed
      if (this.selectedJobSubject.value?.id === job.id) {
        this.selectedJobSubject.next(job);
      }
    } else {
      // Event for a job we don't have yet, refetch list
      this.fetchInitialJobs();
    }
  }

  mapApiJob(apiJob) {
    return {
      id: apiJob.id,
      type: apiJob.type,
      queue: apiJob.queue || 'default',
      status: apiJob.status,
      priority: apiJob.priority || 'medium',
      createdAt: apiJob.created_at,
      startedAt: apiJob.started_at,
      completedAt: apiJob.completed_at,
      duration: '-', // Calculate if needed
      worker: apiJob.worker_id || '-',
      attempts: apiJob.attempts || 0,
      maxRetries: apiJob.max_attempts || 3,
      payload: apiJob.payload || {},
      error: apiJob.error,
      logs: [] // Logs can be fetched separately if supported
    };
  }

  selectJob(job) {
    this.selectedJobSubject.next(job);
  }

  clearSelectedJob() {
    this.selectedJobSubject.next(null);
  }

  async retryJob(jobId) {
    // Note: To truly retry, we should call an API, but for now we simulate or call API if implemented
    console.log('Retry not implemented via API yet');
  }

  async cancelJob(jobId) {
    try {
      const response = await fetch(`${this.apiUrl}/${jobId}/cancel`, { method: 'POST' });
      if (!response.ok) {
        console.error('Failed to cancel job');
      }
    } catch (e) {
      console.error('Error cancelling job', e);
    }
  }

  async enqueueMockJob(type = 'ProcessStripeInvoice', queue = 'billing-webhooks', priority = 'high', customPayload = null, retryLimit = 3) {
    try {
      const payload = {
        type: type,
        queue: queue,
        priority: priority,
        max_attempts: Number(retryLimit),
        payload: customPayload || { user_id: 'usr_' + Math.floor(Math.random() * 10000), action: 'manual_submit' }
      };
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const data = await response.json();
        return this.mapApiJob(data.data.job);
      }
    } catch (e) {
      console.error('Failed to create job', e);
    }
    return null;
  }
}
