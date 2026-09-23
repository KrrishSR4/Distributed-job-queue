package main

import (
	"fmt"
	"net/http"
	"strings"
	"sync"
	"sync/atomic"
	"time"
)

const baseURL = "http://localhost:8080/api/v1/jobs"
const payload = `{"type":"load_test","payload":{},"priority":"medium"}`

func main() {
	concurrency := 50
	totalRequests := 1000

	fmt.Printf("Starting Load Test: %d total requests, %d concurrent workers\n", totalRequests, concurrency)

	var successCount int32
	var failCount int32
	var totalDuration int64

	var wg sync.WaitGroup
	requestsPerWorker := totalRequests / concurrency

	start := time.Now()

	for i := 0; i < concurrency; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			client := &http.Client{Timeout: 5 * time.Second}
			for j := 0; j < requestsPerWorker; j++ {
				reqStart := time.Now()
				resp, err := client.Post(baseURL, "application/json", strings.NewReader(payload))
				if err == nil {
					resp.Body.Close()
					if resp.StatusCode == http.StatusCreated || resp.StatusCode == http.StatusOK {
						atomic.AddInt32(&successCount, 1)
					} else {
						atomic.AddInt32(&failCount, 1)
					}
				} else {
					atomic.AddInt32(&failCount, 1)
				}
				atomic.AddInt64(&totalDuration, int64(time.Since(reqStart)))
			}
		}()
	}

	wg.Wait()
	elapsed := time.Since(start)

	avgDuration := time.Duration(totalDuration / int64(totalRequests))
	reqPerSec := float64(totalRequests) / elapsed.Seconds()

	fmt.Printf("\n--- Load Test Results ---\n")
	fmt.Printf("Total Time: %v\n", elapsed)
	fmt.Printf("Successful Requests: %d\n", successCount)
	fmt.Printf("Failed Requests: %d\n", failCount)
	fmt.Printf("Average Request Latency: %v\n", avgDuration)
	fmt.Printf("Requests Per Second: %.2f req/s\n", reqPerSec)
	
	if failCount > 0 {
		fmt.Printf("WARNING: %d requests failed!\n", failCount)
	}
}
