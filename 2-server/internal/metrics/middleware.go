package metrics

import (
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

// Middleware records HTTP metrics for each request.
func Middleware() func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()

			// Increment in-flight requests
			HttpRequestsInFlight.Inc()
			defer HttpRequestsInFlight.Dec()

			// Wrap the ResponseWriter to capture the status code
			ww := middleware.NewWrapResponseWriter(w, r.ProtoMajor)

			next.ServeHTTP(ww, r)

			// Determine route pattern (low cardinality) instead of raw URL
			routeContext := chi.RouteContext(r.Context())
			routePattern := "unknown"
			if routeContext != nil && routeContext.RoutePattern() != "" {
				routePattern = routeContext.RoutePattern()
			}

			status := strconv.Itoa(ww.Status())
			duration := time.Since(start).Seconds()
			method := r.Method

			HttpRequestsTotal.WithLabelValues(method, routePattern, status).Inc()
			HttpRequestDuration.WithLabelValues(method, routePattern).Observe(duration)
		})
	}
}
