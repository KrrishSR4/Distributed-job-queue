package jobs

import (
	"context"
	"errors"
	"fmt"
	"math"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/models"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

var (
	ErrJobNotFound   = errors.New("job not found")
	ErrInvalidID     = errors.New("invalid job id format")
	ErrInvalidFilter = errors.New("invalid query filter parameters")
)

type Service interface {
	CreateJob(ctx context.Context, req models.CreateJobRequest) (*models.Job, error)
	GetJobByID(ctx context.Context, id string) (*models.Job, error)
	ListJobs(ctx context.Context, filter models.JobListFilter) (*models.PaginatedJobsResponse, error)
	DeleteJob(ctx context.Context, id string) error
}

type JobService struct {
	repo Repository
}

func NewJobService(repo Repository) *JobService {
	return &JobService{repo: repo}
}

func (s *JobService) CreateJob(ctx context.Context, req models.CreateJobRequest) (*models.Job, error) {
	if err := req.Validate(); err != nil {
		return nil, err
	}

	jobID := uuid.New().String()
	now := time.Now().UTC()

	job := &models.Job{
		ID:          jobID,
		Type:        req.Type,
		Payload:     req.Payload,
		Priority:    req.Priority,
		Status:      models.StatusQueued,
		Attempts:    0,
		MaxAttempts: req.MaxAttempts,
		ScheduledAt: req.ScheduledAt,
		CreatedAt:   now,
	}

	if err := s.repo.Create(ctx, job); err != nil {
		return nil, fmt.Errorf("failed to create job: %w", err)
	}

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
