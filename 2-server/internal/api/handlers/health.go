package handlers

import (
	"net/http"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/database"
	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/response"
)

type HealthHandler struct {
	db *database.Database
}

func NewHealthHandler(db *database.Database) *HealthHandler {
	return &HealthHandler{db: db}
}

type HealthResponse struct {
	Status    string    `json:"status"`
	Database  string    `json:"database"`
	Timestamp time.Time `json:"timestamp"`
}

func (h *HealthHandler) HealthCheck(w http.ResponseWriter, r *http.Request) {
	dbStatus := "disconnected"
	if h.db != nil && h.db.IsHealthy(r.Context()) {
		dbStatus = "healthy"
	}

	resp := HealthResponse{
		Status:    "ok",
		Database:  dbStatus,
		Timestamp: time.Now().UTC(),
	}

	response.JSON(w, http.StatusOK, resp)
}
