package routes

import (
	"net/http"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/api/handlers"
	appMiddleware "github.com/KrrishSR4/Distributed-job-queue/server/internal/api/middleware"
	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/response"
	"github.com/go-chi/chi/v5"
)

func SetupRouter(allowedOrigin string, healthHandler *handlers.HealthHandler, jobHandler *handlers.JobHandler) http.Handler {
	r := chi.NewRouter()

	// Middlewares
	r.Use(appMiddleware.RequestID)
	r.Use(appMiddleware.Logger)
	r.Use(appMiddleware.Recovery)
	r.Use(appMiddleware.SetupCORS(allowedOrigin))

	// Health Check
	r.Get("/health", healthHandler.HealthCheck)

	// API V1 Routes
	r.Route("/api/v1", func(r chi.Router) {
		r.Route("/jobs", func(r chi.Router) {
			r.Get("/", jobHandler.ListJobs)
			r.Post("/", jobHandler.CreateJob)
			r.Get("/{id}", jobHandler.GetJob)
			r.Delete("/{id}", jobHandler.DeleteJob)
			r.Post("/{id}/cancel", jobHandler.CancelJob)
		})
	})

	// 404 Handler
	r.NotFound(func(w http.ResponseWriter, r *http.Request) {
		response.NotFound(w, "Route not found")
	})

	return r
}
