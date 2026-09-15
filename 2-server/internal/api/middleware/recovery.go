package middleware

import (
	"fmt"
	"net/http"
	"runtime/debug"

	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/logger"
	"github.com/KrrishSR4/Distributed-job-queue/server/pkg/response"
)

func Recovery(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				reqID := GetRequestID(r.Context())
				stack := string(debug.Stack())

				logger.Error("Unhandled panic recovered",
					"request_id", reqID,
					"panic", fmt.Sprintf("%v", err),
					"stack", stack,
				)

				response.InternalError(w, "An unexpected internal server error occurred")
			}
		}()

		next.ServeHTTP(w, r)
	})
}
