package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"math"
	"net/http"
	"sort"
	"sync"
	"time"
)

type Config struct {
	URL             string
	Method          string
	Requests        int
	Concurrency     int
	IdempotencyTest bool
}

type Result struct {
	StatusCode int
	Duration   time.Duration
	Error      error
}

func main() {
	config := Config{}
	flag.StringVar(&config.URL, "url", "http://localhost:8080/api/v1/jobs", "Target URL")
	flag.IntVar(&config.Requests, "n", 100, "Number of requests to perform")
	flag.IntVar(&config.Concurrency, "c", 10, "Number of multiple requests to make at a time")
	flag.BoolVar(&config.IdempotencyTest, "idempotent", false, "Use the same Idempotency-Key for all requests")
	flag.Parse()

	fmt.Printf("Starting load test...\n")
	fmt.Printf("Target: %s\n", config.URL)
	fmt.Printf("Requests: %d\n", config.Requests)
	fmt.Printf("Concurrency: %d\n", config.Concurrency)
	if config.IdempotencyTest {
		fmt.Printf("Mode: IDEMPOTENCY TEST (same key)\n")
	}

	payload := map[string]interface{}{
		"type":     "load_test_job",
		"priority": "low",
		"payload": map[string]string{
			"timestamp": time.Now().String(),
		},
	}
	bodyBytes, _ := json.Marshal(payload)

	results := make(chan Result, config.Requests)
	var wg sync.WaitGroup

	reqsPerWorker := config.Requests / config.Concurrency
	remainingReqs := config.Requests % config.Concurrency

	start := time.Now()

	for i := 0; i < config.Concurrency; i++ {
		wg.Add(1)
		count := reqsPerWorker
		if i == 0 {
			count += remainingReqs
		}

		go func(count int) {
			defer wg.Done()
			client := &http.Client{
				Timeout: 10 * time.Second,
				Transport: &http.Transport{
					MaxIdleConnsPerHost: config.Concurrency,
				},
			}

			for j := 0; j < count; j++ {
				req, _ := http.NewRequest("POST", config.URL, bytes.NewBuffer(bodyBytes))
				req.Header.Set("Content-Type", "application/json")

				if config.IdempotencyTest {
					req.Header.Set("Idempotency-Key", "load-test-idempotent-key")
				}

				reqStart := time.Now()
				resp, err := client.Do(req)
				duration := time.Since(reqStart)

				if err != nil {
					results <- Result{Error: err, Duration: duration}
					continue
				}
				resp.Body.Close()
				results <- Result{StatusCode: resp.StatusCode, Duration: duration}
			}
		}(count)
	}

	wg.Wait()
	close(results)
	totalDuration := time.Since(start)

	var successCount int
	var errorCount int
	var durations []time.Duration
	statusCodes := make(map[int]int)

	for res := range results {
		if res.Error != nil {
			errorCount++
		} else {
			if res.StatusCode >= 200 && res.StatusCode < 300 {
				successCount++
			} else {
				errorCount++
			}
			statusCodes[res.StatusCode]++
		}
		durations = append(durations, res.Duration)
	}

	sort.Slice(durations, func(i, j int) bool { return durations[i] < durations[j] })

	fmt.Printf("\n--- Results ---\n")
	fmt.Printf("Total Time: %v\n", totalDuration)
	fmt.Printf("Reqs/sec: %.2f\n", float64(config.Requests)/totalDuration.Seconds())
	fmt.Printf("Successful requests: %d\n", successCount)
	fmt.Printf("Failed requests: %d\n", errorCount)

	fmt.Printf("\n--- Status Codes ---\n")
	for code, count := range statusCodes {
		fmt.Printf("[%d] %d responses\n", code, count)
	}

	if len(durations) > 0 {
		var sum time.Duration
		for _, d := range durations {
			sum += d
		}
		avg := time.Duration(int64(sum) / int64(len(durations)))
		p50 := durations[len(durations)/2]
		p95 := durations[int(math.Floor(float64(len(durations))*0.95))]
		p99 := durations[int(math.Floor(float64(len(durations))*0.99))]

		fmt.Printf("\n--- Latency ---\n")
		fmt.Printf("Average: %v\n", avg)
		fmt.Printf("p50: %v\n", p50)
		fmt.Printf("p95: %v\n", p95)
		fmt.Printf("p99: %v\n", p99)
	}
}
