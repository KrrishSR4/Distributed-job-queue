package logger

import (
	"context"
	"log/slog"
	"os"
	"strings"
)

var globalLogger *slog.Logger

func Init(env string, service string) *slog.Logger {
	var handler slog.Handler

	opts := &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}

	if strings.ToLower(env) == "development" || env == "" {
		opts.Level = slog.LevelDebug
		handler = slog.NewTextHandler(os.Stdout, opts)
	} else {
		handler = slog.NewJSONHandler(os.Stdout, opts)
	}

	globalLogger = slog.New(handler).With("service", service)
	slog.SetDefault(globalLogger)
	return globalLogger
}

func Get() *slog.Logger {
	if globalLogger == nil {
		return Init("development", "unknown")
	}
	return globalLogger
}

func Info(msg string, args ...any) {
	Get().Info(msg, args...)
}

func Error(msg string, args ...any) {
	Get().Error(msg, args...)
}

func Debug(msg string, args ...any) {
	Get().Debug(msg, args...)
}

func Warn(msg string, args ...any) {
	Get().Warn(msg, args...)
}

func WithContext(ctx context.Context) *slog.Logger {
	return Get()
}
