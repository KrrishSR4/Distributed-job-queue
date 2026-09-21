package jobs

import (
	"context"
	"errors"
	"fmt"
	"math"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/api/websocket"
	"github.com/KrrishSR4/Distributed-job-queue/server/internal/metrics"
	"github.com/KrrishSR4/Distributed-job-queue/server/internal/models"
	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/logger"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

var (
	ErrJobNotFound             = errors.New("job not found")
	ErrInvalidID               = errors.New("invalid job id format")
	ErrInvalidFilter           = errors.New("invalid query filter parameters")
	ErrJobNotQueued            = errors.New("job is not in a queued state")
	ErrJobNotCancellable       = errors.New("job cannot be cancelled in its current state")
	ErrDuplicateIdempotencyKey = errors.New("duplicate idempotency key")
)

type Service interface {
	CreateJob(ctx context.Context, req models.CreateJobRequest) (*models.Job, error)
	GetJobByID(ctx context.Context, id string) (*models.Job, error)
	ListJobs(ctx context.Context, filter models.JobListFilter) (*models.PaginatedJobsResponse, error)
	DeleteJob(ctx context.Context, id string) error
	CancelJob(ctx context.Context, id string) error
}

type JobService struct {
	repo  Repository
	queue Queue
	pub   websocket.EventPublisher
}

func NewJobService(repo Repository, queue Queue, pub websocket.EventPublisher) *JobService {
	if pub == nil {
		pub = &websocket.NoopEventPublisher{}
	}
	return &JobService{
		repo:  repo,
		queue: queue,
		pub:   pub,
	}
}

func (s *JobService) CreateJob(ctx context.Context, req models.CreateJobRequest) (*models.Job, error) {
	if err := req.Validate(); err != nil {
		return nil, err
	}

	jobID := uuid.New().String()
	now := time.Now().UTC()

	status := models.StatusQueued
	if req.ScheduledAt != nil && req.ScheduledAt.After(now) {
		status = models.StatusScheduled
	}

	job := &models.Job{
		ID:             jobID,
		Type:           req.Type,
		Payload:        req.Payload,
		Priority:       req.Priority,
		Status:         status,
		Attempts:       0,
		MaxAttempts:    req.MaxAttempts,
		ScheduledAt:    req.ScheduledAt,
		CreatedAt:      now,
		IdempotencyKey: req.IdempotencyKey,
	}

	err := s.repo.Create(ctx, job)
	if err != nil {
		if errors.Is(err, ErrDuplicateIdempotencyKey) {
			logger.Info("Duplicate idempotency key detected, returning existing job", "idempotency_key", *req.IdempotencyKey)
			existingJob, fetchErr := s.repo.GetByIdempotencyKey(ctx, *req.IdempotencyKey)
			if fetchErr != nil {
				return nil, fmt.Errorf("failed to fetch existing idempotent job: %w", fetchErr)
			}
			if existingJob == nil {
				return nil, fmt.Errorf("idempotent job was duplicate but not found")
			}
			return existingJob, nil
		}
		return nil, fmt.Errorf("failed to create job in database: %w", err)
	}

	if s.queue != nil && job.Status == models.StatusQueued {
		if err := s.queue.Enqueue(ctx, job); err != nil {
			logger.Error("Failed to enqueue job into Redis queue", "job_id", job.ID, "error", err)
			s.repo.UpdateStatusFailed(ctx, job.ID, time.Now().UTC(), "Failed to enqueue to queue broker: "+err.Error())
			return nil, fmt.Errorf("job persisted to database but failed to enqueue into queue broker")
		}
	}

	eventType := websocket.EventJobQueued
	if job.Status == models.StatusScheduled {
		eventType = websocket.EventJobScheduled
	}
	s.pub.Publish(websocket.Event{
		Type:      eventType,
		JobID:     job.ID,
		Timestamp: time.Now().UTC(),
		Data: map[string]string{
			"status": string(job.Status),
		},
	})

	metrics.JobsCreatedTotal.WithLabelValues(string(job.Type), string(job.Priority)).Inc()

	return job, nil
}

func (s *JobService) GetJobByID(ctx context.Context, id string) (*models.Job, error) {
	if id == "" {
		return nil, ErrInvalidID
	}

	job, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if job == nil {
		return nil, ErrJobNotFound
	}
	return job, nil
}

func (s *JobService) ListJobs(ctx context.Context, filter models.JobListFilter) (*models.PaginatedJobsResponse, error) {
	if filter.Page <= 0 {
		filter.Page = 1
	}
	if filter.Limit <= 0 {
		filter.Limit = 20
	} else if filter.Limit > 100 {
		filter.Limit = 100
	}

	jobs, total, err := s.repo.List(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to list jobs: %w", err)
	}

	totalPages := 0
	if total > 0 {
		totalPages = int(math.Ceil(float64(total) / float64(filter.Limit)))
	}

	if jobs == nil {
		jobs = []*models.Job{}
	}

	return &models.PaginatedJobsResponse{
		Jobs:       jobs,
		Total:      total,
		Page:       filter.Page,
		Limit:      filter.Limit,
		TotalPages: totalPages,
	}, nil
}

func (s *JobService) DeleteJob(ctx context.Context, id string) error {
	if id == "" {
		return ErrInvalidID
	}

	err := s.repo.Delete(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrJobNotFound
		}
		return err
	}
	return nil
}

func (s *JobService) CancelJob(ctx context.Context, id string) error {
	if id == "" {
		return ErrInvalidID
	}

	job, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}
	if job == nil {
		return ErrJobNotFound
	}

	err = s.repo.Cancel(ctx, id)
	if err != nil {
		return err
	}

	s.pub.Publish(websocket.Event{
		Type:      websocket.EventJobCancelled,
		JobID:     id,
		Timestamp: time.Now().UTC(),
		Data: map[string]string{
			"status": string(models.StatusCancelled),
		},
	})

	metrics.JobsCancelledTotal.WithLabelValues(string(job.Type)).Inc()

	return nil
}
