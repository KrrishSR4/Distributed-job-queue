# REST API Specification (Phase 2)

The Distributed Job Queue backend exposes a RESTful HTTP API listening on port `8080` (configurable via `PORT` environment variable).

## Base URL

`http://localhost:8080`

---

## 1. Health Check

### `GET /health`

Verifies that the Go API server process is alive and checks the health status of the PostgreSQL database connection pool.

#### Response `200 OK`

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "database": "healthy",
    "timestamp": "2026-09-15T21:40:00Z"
  }
}
```

---

## 2. Create Job

### `POST /api/v1/jobs`

Enqueues a new background job into the database with an initial status of `queued`.

#### Request Headers
- `Content-Type: application/json`

#### Request Body Example

```json
{
  "type": "email.send_welcome",
  "payload": {
    "recipient": "user@example.com",
    "template_id": "welcome_v2"
  },
  "priority": "high",
  "max_attempts": 3
}
```

#### Field Specifications
| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `type` | string | **Yes** | - | Namespace identifier for the job type (e.g., `email.send`, `media.transcode`). |
| `payload` | object/JSON | No | `{}` | Arbitrary JSON payload data needed by workers to process the job. |
| `priority` | string | No | `medium` | Execution priority (`low`, `medium`, `high`, `critical`). |
| `max_attempts` | integer | No | `3` | Maximum retry attempts before moving job to Dead Letter Queue (DLQ). |
| `scheduled_at` | ISO-8601 string | No | `null` | Optional future timestamp for scheduled execution. |

#### Response `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "e4a2c918-4f81-4b1a-829d-9c3f15b801a2",
    "type": "email.send_welcome",
    "payload": {
      "recipient": "user@example.com",
      "template_id": "welcome_v2"
    },
    "priority": "high",
    "status": "queued",
    "attempts": 0,
    "max_attempts": 3,
    "created_at": "2026-09-15T21:40:05.123Z"
  }
}
```

---

## 3. List Jobs

### `GET /api/v1/jobs`

Retrieves a paginated list of jobs matching optional filter parameters.

#### Query Parameters
- `page` (integer, default `1`): Page number.
- `limit` (integer, default `20`, max `100`): Items per page.
- `status` (string, optional): Filter by status (`queued`, `processing`, `completed`, `failed`).
- `priority` (string, optional): Filter by priority (`low`, `medium`, `high`, `critical`).
- `type` (string, optional): Filter by job type string.

#### Example Request
`GET /api/v1/jobs?status=queued&priority=high&page=1&limit=10`

#### Response `200 OK`

```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "e4a2c918-4f81-4b1a-829d-9c3f15b801a2",
        "type": "email.send_welcome",
        "payload": { "recipient": "user@example.com" },
        "priority": "high",
        "status": "queued",
        "attempts": 0,
        "max_attempts": 3,
        "created_at": "2026-09-15T21:40:05Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "total_pages": 1
  }
}
```

---

## 4. Get Job by ID

### `GET /api/v1/jobs/:id`

Retrieves detailed information for a single job by its UUID.

#### Response `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "e4a2c918-4f81-4b1a-829d-9c3f15b801a2",
    "type": "email.send_welcome",
    "payload": { "recipient": "user@example.com" },
    "priority": "high",
    "status": "queued",
    "attempts": 0,
    "max_attempts": 3,
    "created_at": "2026-09-15T21:40:05Z"
  }
}
```

#### Response `404 Not Found`

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Job with specified ID not found"
  }
}
```

---

## 5. Delete Job

### `DELETE /api/v1/jobs/:id`

Deletes a job from the database by UUID.

#### Response `200 OK`

```json
{
  "success": true,
  "data": {
    "message": "Job deleted successfully",
    "id": "e4a2c918-4f81-4b1a-829d-9c3f15b801a2"
  }
}
```
