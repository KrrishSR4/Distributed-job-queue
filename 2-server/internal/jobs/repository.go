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
	Cancel(ctx context.Context, id string) error
	UpdateStatusProcessing(ctx context.Context, id string, workerID string, startedAt time.Time) error
	UpdateStatusCompleted(ctx context.Context, id string, completedAt time.Time) error
	UpdateStatusFailed(ctx context.Context, id string, failedAt time.Time, errStr string) error
	UpdateStatusRetry(ctx context.Context, id string, errStr string) error
	EnqueueDueScheduledJobs(ctx context.Context, until time.Time, limit int) ([]*models.Job, error)
	RecoverStaleJobs(ctx context.Context, staleBefore time.Time, limit int) ([]*models.Job, error)
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

func (r *PostgresRepository) Cancel(ctx context.Context, id string) error {
	query := `
		UPDATE jobs
		SET status = $2, error = $3
		WHERE id = $1 AND status IN ($4, $5)
	`
	cmd, err := r.pool.Exec(ctx, query, id, models.StatusCancelled, "Job was cancelled", models.StatusQueued, models.StatusScheduled)
	if err != nil {
		return fmt.Errorf("failed to cancel job: %w", err)
	}

	if cmd.RowsAffected() == 0 {
		return ErrJobNotCancellable
	}
	return nil
}

func (r *PostgresRepository) UpdateStatusProcessing(ctx context.Context, id string, workerID string, startedAt time.Time) error {
	query := `
		UPDATE jobs
		SET status = $2, worker_id = $3, started_at = $4, attempts = attempts + 1
		WHERE id = $1 AND status = $5
	`
	cmd, err := r.pool.Exec(ctx, query, id, models.StatusProcessing, workerID, startedAt, models.StatusQueued)
	if err != nil {
		return fmt.Errorf("failed to update job status to processing: %w", err)
	}
	if cmd.RowsAffected() == 0 {
		return ErrJobNotQueued
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

func (r *PostgresRepository) UpdateStatusRetry(ctx context.Context, id string, errStr string) error {
	query := `
		UPDATE jobs
		SET status = $2, error = $3
		WHERE id = $1
	`
	_, err := r.pool.Exec(ctx, query, id, models.StatusQueued, errStr)
	if err != nil {
		return fmt.Errorf("failed to update job status to retry (queued): %w", err)
	}
	return nil
}

func (r *PostgresRepository) EnqueueDueScheduledJobs(ctx context.Context, until time.Time, limit int) ([]*models.Job, error) {
	query := `
		UPDATE jobs
		SET status = $1
		WHERE id IN (
			SELECT id FROM jobs
			WHERE status = $2 AND scheduled_at <= $3
			ORDER BY scheduled_at ASC
			FOR UPDATE SKIP LOCKED
			LIMIT $4
		)
		RETURNING id, type, payload, priority, status, attempts, max_attempts, 
		          scheduled_at, created_at, started_at, completed_at, failed_at, error, worker_id
	`
	rows, err := r.pool.Query(ctx, query, models.StatusQueued, models.StatusScheduled, until, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to enqueue due scheduled jobs: %w", err)
	}
	defer rows.Close()

	var jobs []*models.Job
	for rows.Next() {
		var job models.Job
		err := rows.Scan(
			&job.ID, &job.Type, &job.Payload, &job.Priority, &job.Status, &job.Attempts, &job.MaxAttempts,
			&job.ScheduledAt, &job.CreatedAt, &job.StartedAt, &job.CompletedAt, &job.FailedAt, &job.Error, &job.WorkerID,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan due scheduled job: %w", err)
		}
		jobs = append(jobs, &job)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating due scheduled jobs: %w", err)
	}

	return jobs, nil
}

func (r *PostgresRepository) RecoverStaleJobs(ctx context.Context, staleBefore time.Time, limit int) ([]*models.Job, error) {
	query := `
		UPDATE jobs
		SET status = $1, error = $2
		WHERE id IN (
			SELECT id FROM jobs
			WHERE status = $3 AND started_at <= $4
			ORDER BY started_at ASC
			FOR UPDATE SKIP LOCKED
			LIMIT $5
		)
		RETURNING id, type, payload, priority, status, attempts, max_attempts, 
		          scheduled_at, created_at, started_at, completed_at, failed_at, error, worker_id
	`
	rows, err := r.pool.Query(ctx, query, models.StatusQueued, "Worker timeout or crash detected", models.StatusProcessing, staleBefore, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to recover stale jobs: %w", err)
	}
	defer rows.Close()

	var jobs []*models.Job
	for rows.Next() {
		var job models.Job
		err := rows.Scan(
			&job.ID, &job.Type, &job.Payload, &job.Priority, &job.Status, &job.Attempts, &job.MaxAttempts,
			&job.ScheduledAt, &job.CreatedAt, &job.StartedAt, &job.CompletedAt, &job.FailedAt, &job.Error, &job.WorkerID,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan stale job: %w", err)
		}
		jobs = append(jobs, &job)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating stale jobs: %w", err)
	}

	return jobs, nil
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

func (m *MemoryRepository) Cancel(ctx context.Context, id string) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	job, exists := m.jobs[id]
	if !exists {
		return ErrJobNotFound
	}
	if job.Status != models.StatusQueued && job.Status != models.StatusScheduled {
		return ErrJobNotCancellable
	}
	job.Status = models.StatusCancelled
	errStr := "Job was cancelled"
	job.Error = &errStr
	return nil
}

func (m *MemoryRepository) UpdateStatusProcessing(ctx context.Context, id string, workerID string, startedAt time.Time) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	job, exists := m.jobs[id]
	if !exists {
		return pgx.ErrNoRows
	}
	if job.Status != models.StatusQueued {
		return ErrJobNotQueued
	}
	job.Attempts++
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

func (m *MemoryRepository) UpdateStatusRetry(ctx context.Context, id string, errStr string) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	job, exists := m.jobs[id]
	if !exists {
		return pgx.ErrNoRows
	}
	job.Status = models.StatusQueued
	job.Error = &errStr
	return nil
}

func (m *MemoryRepository) EnqueueDueScheduledJobs(ctx context.Context, until time.Time, limit int) ([]*models.Job, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	var dueJobs []*models.Job
	for _, job := range m.jobs {
		if job.Status == models.StatusScheduled && job.ScheduledAt != nil && !job.ScheduledAt.After(until) {
			dueJobs = append(dueJobs, job)
		}
	}

	sort.Slice(dueJobs, func(i, j int) bool {
		return dueJobs[i].ScheduledAt.Before(*dueJobs[j].ScheduledAt)
	})

	if len(dueJobs) > limit {
		dueJobs = dueJobs[:limit]
	}

	for _, job := range dueJobs {
		job.Status = models.StatusQueued
	}

	return dueJobs, nil
}

func (m *MemoryRepository) RecoverStaleJobs(ctx context.Context, staleBefore time.Time, limit int) ([]*models.Job, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	var staleJobs []*models.Job
	for _, job := range m.jobs {
		if job.Status == models.StatusProcessing && job.StartedAt != nil && !job.StartedAt.After(staleBefore) {
			staleJobs = append(staleJobs, job)
		}
	}

	sort.Slice(staleJobs, func(i, j int) bool {
		return staleJobs[i].StartedAt.Before(*staleJobs[j].StartedAt)
	})

	if len(staleJobs) > limit {
		staleJobs = staleJobs[:limit]
	}

	errStr := "Worker timeout or crash detected"
	for _, job := range staleJobs {
		job.Status = models.StatusQueued
		job.Error = &errStr
	}

	return staleJobs, nil
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
