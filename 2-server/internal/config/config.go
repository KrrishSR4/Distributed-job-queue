package config

import (
	"os"
	"strconv"

	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/logger"
	"github.com/joho/godotenv"
)

type Config struct {
	Port          string
	DatabaseURL   string
	RedisURL      string
	RedisQueueKey string
	AppEnv        string
	AllowedOrigin string
	WorkerCount   int
}

func Load() *Config {
	if err := godotenv.Load(); err != nil {
		logger.Debug("No .env file found, reading environment variables directly")
	}

	workerCountStr := getEnv("WORKER_COUNT", "3")
	workerCount, err := strconv.Atoi(workerCountStr)
	if err != nil || workerCount <= 0 {
		logger.Warn("Invalid WORKER_COUNT specified, defaulting to 3", "specified", workerCountStr)
		workerCount = 3
	}

	cfg := &Config{
		Port:          getEnv("PORT", "8080"),
		DatabaseURL:   getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/djq_db?sslmode=disable"),
		RedisURL:      getEnv("REDIS_URL", "redis://localhost:6379"),
		RedisQueueKey: getEnv("REDIS_QUEUE_KEY", "jobs:queue"),
		AppEnv:        getEnv("APP_ENV", "development"),
		AllowedOrigin: getEnv("ALLOWED_ORIGIN", "http://localhost:4200"),
		WorkerCount:   workerCount,
	}

	return cfg
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists && value != "" {
		return value
	}
	return defaultValue
}
