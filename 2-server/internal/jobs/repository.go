package jobs

import (
	"context"
	"fmt"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/models"
	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/logger"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	Create(ctx context.Context, job *models.Job) error
	GetByID(ctx context.Context, id string) (*models.Job, error)
	List(ctx context.Context, filter models.JobListFilter) ([]*models.Job, int, error)
	Delete(ctx context.Context, id string) error
	UpdateStatusProcessing(ctx context.Context, id string, workerID string, startedAt time.Time) error
	UpdateStatusCompleted(ctx context.Context, id string, completedAt time.Time) error
	UpdateStatusFailed(ctx context.Context, id string, failedAt time.Time, errStr string) error
}

type PostgresRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresRepository(pool *pgxpool.Pool) *PostgresRepository {
	return &PostgresRepository{pool: pool}
}

func (r *PostgresRepository) Create(ctx context.Context, job *models.Job) error {
	query := `
		INSERT INTO jobs (
			id, type, payload, priority, status, attempts, max_attempts, 
			scheduled_at, created_at, started_at, completed_at, failed_at, error, worker_id
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
		)
	`
	_, err := r.pool.Exec(ctx, query,
		job.ID, job.Type, job.Payload, job.Priority, job.Status, job.Attempts, job.MaxAttempts,
		job.ScheduledAt, job.CreatedAt, job.StartedAt, job.CompletedAt, job.FailedAt, job.Error, job.WorkerID,
	)
	if err != nil {
		return fmt.Errorf("failed to insert job: %w", err)
	}
	return nil
}

func (r *PostgresRepository) GetByID(ctx context.Context, id string) (*models.Job, error) {
	query := `
		SELECT id, type, payload, priority, status, attempts, max_attempts, 
		       scheduled_at, created_at, started_at, completed_at, failed_at, error, worker_id
		FROM jobs
		WHERE id = $1
	`
	row := r.pool.QueryRow(ctx, query, id)

	var job models.Job
	err := row.Scan(
		&job.ID, &job.Type, &job.Payload, &job.Priority, &job.Status, &job.Attempts, &job.MaxAttempts,
		&job.ScheduledAt, &job.CreatedAt, &job.StartedAt, &job.CompletedAt, &job.FailedAt, &job.Error, &job.WorkerID,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to fetch job: %w", err)
	}
	return &job, nil
}

func (r *PostgresRepository) List(ctx context.Context, filter models.JobListFilter) ([]*models.Job, int, error) {
	whereClauses := []string{"1=1"}
	args := []interface{}{}
	argIdx := 1

	if filter.Status != "" {
		whereClauses = append(whereClauses, fmt.Sprintf("status = $%d", argIdx))
		args = append(args, filter.Status)
		argIdx++
	}

	if filter.Priority != "" {
		whereClauses = append(whereClauses, fmt.Sprintf("priority = $%d", argIdx))
		args = append(args, filter.Priority)
		argIdx++
	}

	if filter.Type != "" {
		whereClauses = append(whereClauses, fmt.Sprintf("type = $%d", argIdx))
		args = append(args, filter.Type)
		argIdx++
	}

	whereStmt := strings.Join(whereClauses, " AND ")

	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM jobs WHERE %s", whereStmt)
	var total int
	if err := r.pool.QueryRow(ctx, countQuery, args...).Scan(&total); err != nil {
		return nil, 0, fmt.Errorf("failed to count jobs: %w", err)
	}

	offset := (filter.Page - 1) * filter.Limit
	query := fmt.Sprintf(`
		SELECT id, type, payload, priority, status, attempts, max_attempts, 
		       scheduled_at, created_at, started_at, completed_at, failed_at, error, worker_id
		FROM jobs
		WHERE %s
		ORDER BY created_at DESC
		LIMIT $%d OFFSET $%d
	`, whereStmt, argIdx, argIdx+1)

	args = append(args, filter.Limit, offset)

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to query jobs: %w", err)
	}
	defer rows.Close()

	jobs := []*models.Job{}
	for rows.Next() {
		var job models.Job
		err := rows.Scan(
			&job.ID, &job.Type, &job.Payload, &job.Priority, &job.Status, &job.Attempts, &job.MaxAttempts,
			&job.ScheduledAt, &job.CreatedAt, &job.StartedAt, &job.CompletedAt, &job.FailedAt, &job.Error, &job.WorkerID,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan job row: %w", err)
		}
		jobs = append(jobs, &job)
	}

	return jobs, total, nil
}

func (r *PostgresRepository) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM jobs WHERE id = $1`
	cmd, err := r.pool.Exec(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete job: %w", err)
	}
	if cmd.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *PostgresRepository) UpdateStatusProcessing(ctx context.Context, id string, workerID string, startedAt time.Time) error {
	query := `
		UPDATE jobs
		SET status = $2, worker_id = $3, started_at = $4
		WHERE id = $1
	`
	_, err := r.pool.Exec(ctx, query, id, models.StatusProcessing, workerID, startedAt)
	if err != nil {
		return fmt.Errorf("failed to update job status to processing: %w", err)
	}
	return nil
}

func (r *PostgresRepository) UpdateStatusCompleted(ctx context.Context, id string, completedAt time.Time) error {
	query := `
		UPDATE jobs
		SET status = $2, completed_at = $3
		WHERE id = $1
	`
	_, err := r.pool.Exec(ctx, query, id, models.StatusCompleted, completedAt)
	if err != nil {
		return fmt.Errorf("failed to update job status to completed: %w", err)
	}
	return nil
}

func (r *PostgresRepository) UpdateStatusFailed(ctx context.Context, id string, failedAt time.Time, errStr string) error {
	query := `
		UPDATE jobs
		SET status = $2, failed_at = $3, error = $4
		WHERE id = $1
	`
	_, err := r.pool.Exec(ctx, query, id, models.StatusFailed, failedAt, errStr)
	if err != nil {
		return fmt.Errorf("failed to update job status to failed: %w", err)
	}
	return nil
}

// MemoryRepository provides an in-memory fallback for standalone testing or development without a live PostgreSQL instance.
type MemoryRepository struct {
	mu   sync.RWMutex
	jobs map[string]*models.Job
}

func NewMemoryRepository() *MemoryRepository {
	return &MemoryRepository{
		jobs: make(map[string]*models.Job),
	}
}

func (m *MemoryRepository) Create(ctx context.Context, job *models.Job) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.jobs[job.ID] = job
	logger.Debug("Created job in MemoryRepository", "id", job.ID)
	return nil
}

func (m *MemoryRepository) GetByID(ctx context.Context, id string) (*models.Job, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	job, exists := m.jobs[id]
	if !exists {
		return nil, nil
	}
	return job, nil
}

func (m *MemoryRepository) List(ctx context.Context, filter models.JobListFilter) ([]*models.Job, int, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	filtered := []*models.Job{}
	for _, j := range m.jobs {
		if filter.Status != "" && j.Status != filter.Status {
			continue
		}
		if filter.Priority != "" && j.Priority != filter.Priority {
			continue
		}
		if filter.Type != "" && j.Type != filter.Type {
			continue
		}
		filtered = append(filtered, j)
	}

	sort.Slice(filtered, func(i, j int) bool {
		return filtered[i].CreatedAt.After(filtered[j].CreatedAt)
	})

	total := len(filtered)
	offset := (filter.Page - 1) * filter.Limit
	if offset >= total {
		return []*models.Job{}, total, nil
	}

	end := offset + filter.Limit
	if end > total {
		end = total
	}

	return filtered[offset:end], total, nil
}

func (m *MemoryRepository) Delete(ctx context.Context, id string) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	if _, exists := m.jobs[id]; !exists {
		return pgx.ErrNoRows
	}
	delete(m.jobs, id)
	return nil
}

func (m *MemoryRepository) UpdateStatusProcessing(ctx context.Context, id string, workerID string, startedAt time.Time) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	job, exists := m.jobs[id]
	if !exists {
		return pgx.ErrNoRows
	}
	job.Status = models.StatusProcessing
	job.WorkerID = &workerID
	job.StartedAt = &startedAt
	return nil
}

func (m *MemoryRepository) UpdateStatusCompleted(ctx context.Context, id string, completedAt time.Time) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	job, exists := m.jobs[id]
	if !exists {
		return pgx.ErrNoRows
	}
	job.Status = models.StatusCompleted
	job.CompletedAt = &completedAt
	return nil
}

func (m *MemoryRepository) UpdateStatusFailed(ctx context.Context, id string, failedAt time.Time, errStr string) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	job, exists := m.jobs[id]
	if !exists {
		return pgx.ErrNoRows
	}
	job.Status = models.StatusFailed
	job.FailedAt = &failedAt
	job.Error = &errStr
	return nil
}

// SeedMockData populates initial mock jobs into the MemoryRepository for rich initial data
func (m *MemoryRepository) SeedMockData() {
	now := time.Now()
	mockJobs := []*models.Job{
		{
			ID:          "job-1001",
			Type:        "email.send_welcome",
			Payload:     []byte(`{"to":"user@example.com","template":"welcome_v2"}`),
			Priority:    models.PriorityHigh,
			Status:      models.StatusQueued,
			Attempts:    0,
			MaxAttempts: 3,
			CreatedAt:   now.Add(-5 * time.Minute),
		},
		{
			ID:          "job-1002",
			Type:        "media.transcode_video",
			Payload:     []byte(`{"video_id":"vid_9872","resolution":"1080p"}`),
			Priority:    models.PriorityMedium,
			Status:      models.StatusQueued,
			Attempts:    0,
			MaxAttempts: 3,
			CreatedAt:   now.Add(-12 * time.Minute),
		},
		{
			ID:          "job-1003",
			Type:        "report.generate_pdf",
			Payload:     []byte(`{"account_id":"acc_4412","month":"2026-08"}`),
			Priority:    models.PriorityLow,
			Status:      models.StatusCompleted,
			Attempts:    1,
			MaxAttempts: 3,
			CreatedAt:   now.Add(-30 * time.Minute),
		},
	}

	for _, j := range mockJobs {
		m.jobs[j.ID] = j
	}
}
