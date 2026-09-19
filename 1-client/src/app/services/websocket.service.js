import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private ws = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private url = 'ws://localhost:8080/ws';
  
  public events$ = new Subject();
  public connectionStatus$ = new Subject(); // 'connected', 'connecting', 'disconnected'

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
        const data = JSON.parse(event.data);
        this.events$.next(data);
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

  private scheduleReconnect() {
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
