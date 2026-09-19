package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/jobs"
	"github.com/KrrishSR4/Distributed-job-queue/server/internal/models"
	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/response"
	"github.com/go-chi/chi/v5"
)

type JobHandler struct {
	service jobs.Service
}

func NewJobHandler(service jobs.Service) *JobHandler {
	return &JobHandler{service: service}
}

func (h *JobHandler) CreateJob(w http.ResponseWriter, r *http.Request) {
	var req models.CreateJobRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.ValidationError(w, "Invalid JSON request payload: "+err.Error())
		return
	}

	idempotencyKey := r.Header.Get("Idempotency-Key")
	if idempotencyKey != "" {
		req.IdempotencyKey = &idempotencyKey
	}

	job, err := h.service.CreateJob(r.Context(), req)
	if err != nil {
		response.ValidationError(w, err.Error())
		return
	}

	response.JSON(w, http.StatusCreated, job)
}

func (h *JobHandler) GetJob(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		response.ValidationError(w, "Job ID is required")
		return
	}

	job, err := h.service.GetJobByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, jobs.ErrJobNotFound) {
			response.NotFound(w, "Job with specified ID not found")
			return
		}
		if errors.Is(err, jobs.ErrInvalidID) {
			response.ValidationError(w, "Invalid job ID format")
			return
		}
		response.InternalError(w, "Failed to retrieve job: "+err.Error())
		return
	}

	response.JSON(w, http.StatusOK, job)
}

func (h *JobHandler) ListJobs(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()

	page, _ := strconv.Atoi(q.Get("page"))
	limit, _ := strconv.Atoi(q.Get("limit"))

	filter := models.JobListFilter{
		Status:   models.JobStatus(q.Get("status")),
		Priority: models.JobPriority(q.Get("priority")),
		Type:     q.Get("type"),
		Page:     page,
		Limit:    limit,
	}

	paginated, err := h.service.ListJobs(r.Context(), filter)
	if err != nil {
		response.InternalError(w, "Failed to list jobs: "+err.Error())
		return
	}

	response.JSON(w, http.StatusOK, paginated)
}

func (h *JobHandler) DeleteJob(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		response.ValidationError(w, "Job ID is required")
		return
	}

	err := h.service.DeleteJob(r.Context(), id)
	if err != nil {
		if errors.Is(err, jobs.ErrJobNotFound) {
			response.NotFound(w, "Job with specified ID not found")
			return
		}
		if errors.Is(err, jobs.ErrInvalidID) {
			response.ValidationError(w, "Invalid job ID format")
			return
		}
		response.InternalError(w, "Failed to delete job: "+err.Error())
		return
	}

	response.JSON(w, http.StatusOK, map[string]string{
		"message": "Job deleted successfully",
		"id":      id,
	})
}

func (h *JobHandler) CancelJob(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		response.ValidationError(w, "Job ID is required")
		return
	}

	err := h.service.CancelJob(r.Context(), id)
	if err != nil {
		if errors.Is(err, jobs.ErrJobNotFound) {
			response.NotFound(w, "Job with specified ID not found")
			return
		}
		if errors.Is(err, jobs.ErrInvalidID) {
			response.ValidationError(w, "Invalid job ID format")
			return
		}
		if errors.Is(err, jobs.ErrJobNotCancellable) {
			response.ValidationError(w, "Job cannot be cancelled in its current state")
			return
		}
		response.InternalError(w, "Failed to cancel job: "+err.Error())
		return
	}

	response.JSON(w, http.StatusOK, map[string]string{
		"message": "Job cancelled successfully",
		"id":      id,
	})
}
