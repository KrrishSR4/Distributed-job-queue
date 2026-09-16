package redis

import (
	"context"
	"testing"
)

func TestNewClientInvalidURL(t *testing.T) {
	ctx := context.Background()
	_, err := NewClient(ctx, "invalid-url-schema://localhost:6379")
	if err == nil {
		t.Errorf("expected error for invalid redis URL schema, got nil")
	}
}

func TestNewClientParseValidURL(t *testing.T) {
	ctx := context.Background()
	client, err := NewClient(ctx, "redis://localhost:6379")
	if err != nil {
		t.Fatalf("unexpected error parsing valid redis URL: %v", err)
	}
	if client == nil {
		t.Fatalf("expected non-nil client")
	}

	// Health check returns boolean without crashing even if Redis server is offline
	_ = client.IsHealthy(ctx)

	client.Close()
}
