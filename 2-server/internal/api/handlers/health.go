package handlers

import (
	"net/http"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/database"
	appRedis "github.com/KrrishSR4/Distributed-job-queue/server/internal/redis"
	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/response"
)

type HealthHandler struct {
	db    *database.Database
	redis *appRedis.Client
}

func NewHealthHandler(db *database.Database, redisClient *appRedis.Client) *HealthHandler {
	return &HealthHandler{
		db:    db,
		redis: redisClient,
	}
}

type HealthResponse struct {
	Status    string    `json:"status"`
	Database  string    `json:"database"`
	Redis     string    `json:"redis"`
	Timestamp time.Time `json:"timestamp"`
}

func (h *HealthHandler) HealthCheck(w http.ResponseWriter, r *http.Request) {
	dbStatus := "disconnected"
	if h.db != nil && h.db.IsHealthy(r.Context()) {
		dbStatus = "connected"
	}

	redisStatus := "disconnected"
	if h.redis != nil && h.redis.IsHealthy(r.Context()) {
		redisStatus = "connected"
	}

	resp := HealthResponse{
		Status:    "ok",
		Database:  dbStatus,
		Redis:     redisStatus,
		Timestamp: time.Now().UTC(),
	}

	response.JSON(w, http.StatusOK, resp)
}
