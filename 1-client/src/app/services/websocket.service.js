import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  ws = null;
  reconnectAttempts = 0;
  maxReconnectAttempts = 5;
  url = 'ws://localhost:8080/ws';
  
  events$ = new Subject();
  connectionStatus$ = new Subject(); // 'connected', 'connecting', 'disconnected'

  constructor() {
    this.connect();
  }

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.connectionStatus$.next('connecting');
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('[WebSocket] Connected');
      this.connectionStatus$.next('connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const lines = event.data.split('\n');
        for (const line of lines) {
          if (!line.trim()) continue;
          const data = JSON.parse(line);
          this.events$.next(data);
        }
      } catch (e) {
        console.error('[WebSocket] Error parsing message', e);
      }
    };

    this.ws.onclose = () => {
      console.log('[WebSocket] Disconnected');
      this.connectionStatus$.next('disconnected');
      this.scheduleReconnect();
    };

    this.ws.onerror = (err) => {
      console.error('[WebSocket] Error', err);
      // onclose will handle reconnect
    };
  }

  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('[WebSocket] Max reconnect attempts reached');
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
    this.reconnectAttempts++;
    console.log(`[WebSocket] Reconnecting in ${delay}ms (Attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  disconnect() {
    if (this.ws) {
      this.maxReconnectAttempts = 0; // Prevent auto-reconnect
      this.ws.close();
      this.ws = null;
    }
  }
}
