package websocket

import (
	"context"
	"encoding/json"
	"net/http"
	"sync"

	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/logger"
)

// Hub maintains the set of active clients and broadcasts messages to the clients.
type Hub struct {
	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the components.
	broadcast chan []byte

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client
	
	mu sync.RWMutex
}

func NewHub() *Hub {
	return &Hub{
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

func (h *Hub) Run(ctx context.Context) {
	logger.Info("WebSocket Hub started")
	for {
		select {
		case <-ctx.Done():
			logger.Info("WebSocket Hub stopping on shutdown")
			h.Shutdown()
			return
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()
			logger.Info("WebSocket client registered")
		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
				logger.Info("WebSocket client unregistered")
			}
			h.mu.Unlock()
		case message := <-h.broadcast:
			h.mu.RLock()
			for client := range h.clients {
				select {
				case client.send <- message:
				default:
					// Slow client. Disconnect it to protect the hub.
					delete(h.clients, client)
					close(client.send)
					logger.Warn("WebSocket client too slow, disconnected")
				}
			}
			h.mu.RUnlock()
		}
	}
}

// Publish serializes and broadcasts an Event to all connected clients.
func (h *Hub) Publish(event Event) {
	bytes, err := json.Marshal(event)
	if err != nil {
		logger.Error("Failed to marshal websocket event", "error", err)
		return
	}
	// We want to avoid blocking if the hub is shutting down or busy.
	select {
	case h.broadcast <- bytes:
	default:
		logger.Warn("WebSocket broadcast channel full, dropping event", "event_type", event.Type)
	}
}

// ServeWs handles websocket requests from the peer.
func (h *Hub) ServeWs(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		logger.Error("WebSocket upgrade failed", "error", err)
		return
	}
	client := &Client{hub: h, conn: conn, send: make(chan []byte, 256)}
	h.register <- client

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.writePump()
	go client.readPump()
}

func (h *Hub) Shutdown() {
	h.mu.Lock()
	defer h.mu.Unlock()
	for client := range h.clients {
		close(client.send)
		delete(h.clients, client)
	}
	logger.Info("WebSocket Hub shutdown complete")
}
