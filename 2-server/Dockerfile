# Stage 1: Build the Go binary
FROM golang:1.25.0-alpine AS builder

# Set working directory
WORKDIR /app

# Install git and certificates
RUN apk add --no-cache git ca-certificates

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application statically
# CGO_ENABLED=0 ensures a static binary compatible with minimal alpine runtime
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o dist-job-queue ./cmd/api

# Stage 2: Minimal runtime image
FROM alpine:latest

# Set working directory
WORKDIR /app

# Add CA certificates (needed if calling external HTTPS APIs)
RUN apk --no-cache add ca-certificates tzdata

# Create a non-root user for security
RUN adduser -D -g '' appuser

# Copy the binary from the builder stage
COPY --from=builder /app/dist-job-queue .

# Change ownership to the non-root user
RUN chown -R appuser:appuser /app

# Switch to the non-root user
USER appuser

# Expose default API port (can be overridden by environment variable)
EXPOSE 8080

# Run the executable
# The application mode (API or Worker) is controlled via the APP_MODE environment variable
ENTRYPOINT ["./dist-job-queue"]
