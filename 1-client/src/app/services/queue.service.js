import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { INITIAL_QUEUES } from '../models/mock-data.js';

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  constructor() {
    this.queuesSubject = new BehaviorSubject(INITIAL_QUEUES);
    this.queues$ = this.queuesSubject.asObservable();
  }

  toggleQueueState(queueId) {
    const updated = this.queuesSubject.value.map(q => {
      if (q.id === queueId) {
        return {
          ...q,
          status: q.status === 'active' ? 'paused' : 'active'
        };
      }
      return q;
    });
    this.queuesSubject.next(updated);
  }

  purgeQueue(queueId) {
    const updated = this.queuesSubject.value.map(q => {
      if (q.id === queueId) {
        return {
          ...q,
          depth: 0,
          pending: 0
        };
      }
      return q;
    });
    this.queuesSubject.next(updated);
  }

  createQueue(name, priorityWeight = 5, maxConcurrency = 50) {
    const newId = 'q-' + (this.queuesSubject.value.length + 1);
    const newQueue = {
      id: newId,
      name,
      depth: 0,
      rate: 0,
      pending: 0,
      failed: 0,
      maxConcurrency: Number(maxConcurrency),
      priorityWeight: Number(priorityWeight),
      status: 'active'
    };
    this.queuesSubject.next([...this.queuesSubject.value, newQueue]);
  }
}
