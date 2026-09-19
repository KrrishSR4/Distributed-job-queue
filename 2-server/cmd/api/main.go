package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/KrrishSR4/Distributed-job-queue/server/internal/api/handlers"
	"github.com/KrrishSR4/Distributed-job-queue/server/internal/api/routes"
	"github.com/KrrishSR4/Distributed-job-queue/server/internal/config"
	"github.com/KrrishSR4/Distributed-job-queue/server/internal/database"
	"github.com/KrrishSR4/Distributed-job-queue/server/internal/jobs"
	appRedis "github.com/KrrishSR4/Distributed-job-queue/server/internal/redis"
	"github.com/KrrishSR4/Distributed-job-queue/server/internal/workers"
	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/logger"
)

func main() {
	cfg := config.Load()

	log := logger.Init(cfg.AppEnv)
	log.Info("Starting Distributed Job Queue API Server...",
		"env", cfg.AppEnv,
		"port", cfg.Port,
		"worker_count", cfg.WorkerCount,
		"allowed_origin", cfg.AllowedOrigin,
	)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var repo jobs.Repository
	db, err := database.NewPostgresPool(ctx, cfg.DatabaseURL)

	if err == nil && db.IsHealthy(ctx) {
		log.Info("Using PostgreSQL Database Repository")
		repo = jobs.NewPostgresRepository(db.Pool)
	} else {
		log.Warn("PostgreSQL unavailable or disconnected. Falling back to In-Memory Repository for local dev testing")
		memRepo := jobs.NewMemoryRepository()
		memRepo.SeedMockData()
		repo = memRepo
	}

	redisClient, err := appRedis.NewClient(ctx, cfg.RedisURL)
	if err != nil {
		log.Warn("Failed to initialize Redis client", "error", err)
	}

	var queue jobs.Queue
	if redisClient != nil && redisClient.IsHealthy(ctx) {
		log.Info("Using Redis Job Queue", "key", cfg.RedisQueueKey, "dlq_key", cfg.RedisDLQKey)
		queue = jobs.NewRedisQueue(redisClient, cfg.RedisQueueKey, cfg.RedisDLQKey)
	} else {
		log.Warn("Redis unavailable or disconnected. Falling back to Memory Queue for local dev testing")
		queue = jobs.NewMemoryQueue()
	}

	jobService := jobs.NewJobService(repo, queue)

	// Initialize and start Worker Pool
	processor := workers.NewDemoProcessor(200 * time.Millisecond)
	workerPool := workers.NewWorkerPool(cfg.WorkerCount, repo, queue, processor, cfg.RetryBaseDelay, cfg.RetryMaxDelay, cfg.JobTimeout)
	workerPool.Start()

	// Initialize and start Scheduler
	scheduler := workers.NewScheduler(repo, queue, 5*time.Second, cfg.JobRecoveryInterval, cfg.JobStaleTimeout, 50)
	go scheduler.Start(ctx)

	healthHandler := handlers.NewHealthHandler(db, redisClient)
	jobHandler := handlers.NewJobHandler(jobService)

	router := routes.SetupRouter(cfg.AllowedOrigin, healthHandler, jobHandler)

	serverAddr := fmt.Sprintf(":%s", cfg.Port)
	server := &http.Server{
		Addr:         serverAddr,
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	serverCtx, serverStopCtx := context.WithCancel(context.Background())

	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		<-sig
		log.Info("Received shutdown signal. Initiating graceful shutdown...")

		shutdownCtx, shutdownCancel := context.WithTimeout(serverCtx, 10*time.Second)
		defer shutdownCancel()

		go func() {
			<-shutdownCtx.Done()
			if errors.Is(shutdownCtx.Err(), context.DeadlineExceeded) {
				log.Error("Graceful shutdown timed out. Forcing exit.")
			}
		}()

		if err := server.Shutdown(shutdownCtx); err != nil {
			log.Error("HTTP server shutdown error", "error", err)
		}

		// Stop components gracefully
		scheduler.Stop()
		workerPool.Stop()

		if db != nil {
			db.Close()
		}

		if redisClient != nil {
			redisClient.Close()
		}

		serverStopCtx()
	}()

	log.Info(fmt.Sprintf("Server listening and serving HTTP on http://localhost:%s", cfg.Port))
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Error("HTTP server failed to start", "error", err)
		os.Exit(1)
	}

	<-serverCtx.Done()
	log.Info("Server shutdown complete. Goodbye!")
}
