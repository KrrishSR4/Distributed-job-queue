package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	// HTTP Metrics
	HttpRequestsTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "djq_http_requests_total",
		Help: "Total number of HTTP requests processed, partitioned by status code, method, and HTTP path.",
	}, []string{"method", "route", "status"})

	HttpRequestDuration = promauto.NewHistogramVec(prometheus.HistogramOpts{
		Name:    "djq_http_request_duration_seconds",
		Help:    "Latency of HTTP requests in seconds.",
		Buckets: prometheus.DefBuckets,
	}, []string{"method", "route"})

	HttpRequestsInFlight = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "djq_http_requests_in_flight",
		Help: "Current number of HTTP requests being served.",
	})

	// Job Lifecycle Metrics
	JobsCreatedTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "djq_jobs_created_total",
		Help: "Total number of jobs created.",
	}, []string{"job_type", "priority"})

	JobsCompletedTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "djq_jobs_completed_total",
		Help: "Total number of successfully completed jobs.",
	}, []string{"job_type"})

	JobsFailedTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "djq_jobs_failed_total",
		Help: "Total number of jobs that failed during processing.",
	}, []string{"job_type"})

	JobsCancelledTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "djq_jobs_cancelled_total",
		Help: "Total number of jobs cancelled.",
	}, []string{"job_type"})

	JobsRetriedTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "djq_jobs_retried_total",
		Help: "Total number of jobs scheduled for retry after a failure.",
	}, []string{"job_type"})

	JobsDLQTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "djq_jobs_dlq_total",
		Help: "Total number of jobs sent to the Dead Letter Queue (DLQ).",
	}, []string{"job_type"})

	// Job Processing Metrics
	JobProcessingDuration = promauto.NewHistogramVec(prometheus.HistogramOpts{
		Name:    "djq_job_processing_duration_seconds",
		Help:    "Histogram of job processing durations.",
		Buckets: []float64{0.1, 0.5, 1, 2, 5, 10, 30, 60, 120, 300},
	}, []string{"job_type", "status"}) // status: success, error

	// Worker Metrics
	WorkersActive = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "djq_workers_active",
		Help: "Number of active workers currently polling or processing.",
	})

	JobsProcessing = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "djq_jobs_processing",
		Help: "Number of jobs currently being processed by workers.",
	})

	WorkerErrorsTotal = promauto.NewCounter(prometheus.CounterOpts{
		Name: "djq_worker_errors_total",
		Help: "Total number of internal worker errors (not job failures, but system errors).",
	})
)
