package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type PaginatedJobsResponse struct {
	Total int `json:"total"`
}

func main() {
	fmt.Println("Starting worker throughput test...")
	url := "http://localhost:8080/api/v1/jobs"

	// Create a unique type to filter
	jobType := fmt.Sprintf("worker_test_%d", time.Now().Unix())
	jobCount := 50

	payload := map[string]interface{}{
		"type":     jobType,
		"priority": "high",
		"payload":  map[string]string{"test": "true"},
	}
	bodyBytes, _ := json.Marshal(payload)

	// Submit jobs
	startSubmit := time.Now()
	for i := 0; i < jobCount; i++ {
		http.Post(url, "application/json", bytes.NewBuffer(bodyBytes))
	}
	fmt.Printf("Submitted %d jobs in %v\n", jobCount, time.Since(startSubmit))

	// Poll until completed
	startProcess := time.Now()
	for {
		resp, err := http.Get(fmt.Sprintf("%s?type=%s&status=completed", url, jobType))
		if err == nil {
			var result PaginatedJobsResponse
			json.NewDecoder(resp.Body).Decode(&result)
			resp.Body.Close()
			if result.Total == jobCount {
				break
			}
		}
		time.Sleep(200 * time.Millisecond)
	}
	duration := time.Since(startProcess)

	fmt.Printf("All jobs completed in %v\n", duration)
	fmt.Printf("Worker Throughput: %.2f jobs/sec\n", float64(jobCount)/duration.Seconds())
}
