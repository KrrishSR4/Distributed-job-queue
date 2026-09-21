package websocket

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/logger"
	"github.com/gorilla/websocket"
)

func init() {
	logger.Init("test", "test")
}

func TestHubRegistrationAndBroadcast(t *testing.T) {
	hub := NewHub()
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go hub.Run(ctx)

	server := httptest.NewServer(http.HandlerFunc(hub.ServeWs))
	defer server.Close()

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http")

	// Connect Client 1
	dialer := websocket.Dialer{}
	conn1, _, err := dialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("Failed to connect client 1: %v", err)
	}
	defer conn1.Close()

	// Connect Client 2
	conn2, _, err := dialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("Failed to connect client 2: %v", err)
	}
	defer conn2.Close()

	// Wait for registration
	time.Sleep(100 * time.Millisecond)

	hub.mu.RLock()
	if len(hub.clients) != 2 {
		t.Errorf("Expected 2 clients, got %d", len(hub.clients))
	}
	hub.mu.RUnlock()

	// Publish an event
	event := Event{
		Type:      EventJobQueued,
		JobID:     "test-job-123",
		Timestamp: time.Now().UTC(),
		Data: map[string]string{
			"status": "queued",
		},
	}
	hub.Publish(event)

	// Verify Client 1 receives it
	_ = conn1.SetReadDeadline(time.Now().Add(time.Second))
	var received1 Event
	err = conn1.ReadJSON(&received1)
	if err != nil {
		t.Fatalf("Client 1 failed to read JSON: %v", err)
	}
	if received1.JobID != "test-job-123" || received1.Type != EventJobQueued {
		t.Errorf("Client 1 received unexpected event: %+v", received1)
	}

	// Verify Client 2 receives it
	_ = conn2.SetReadDeadline(time.Now().Add(time.Second))
	var received2 Event
	err = conn2.ReadJSON(&received2)
	if err != nil {
		t.Fatalf("Client 2 failed to read JSON: %v", err)
	}
	if received2.JobID != "test-job-123" {
		t.Errorf("Client 2 received unexpected event: %+v", received2)
	}

	// Unregister client 1
	conn1.Close()
	time.Sleep(100 * time.Millisecond)

	hub.mu.RLock()
	if len(hub.clients) != 1 {
		t.Errorf("Expected 1 client after disconnect, got %d", len(hub.clients))
	}
	hub.mu.RUnlock()
}
