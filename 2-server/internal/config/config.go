package config

import (
	"os"

	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/logger"
	"github.com/joho/godotenv"
)

type Config struct {
	Port          string
	DatabaseURL   string
	AppEnv        string
	AllowedOrigin string
}

func Load() *Config {
	if err := godotenv.Load(); err != nil {
		logger.Debug("No .env file found, reading environment variables directly")
	}

	cfg := &Config{
		Port:          getEnv("PORT", "8080"),
		DatabaseURL:   getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/djq_db?sslmode=disable"),
		AppEnv:        getEnv("APP_ENV", "development"),
		AllowedOrigin: getEnv("ALLOWED_ORIGIN", "http://localhost:4200"),
	}

	return cfg
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists && value != "" {
		return value
	}
	return defaultValue
}
