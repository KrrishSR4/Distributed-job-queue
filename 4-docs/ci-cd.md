# CI/CD Pipeline

The Distributed Job Queue utilizes GitHub Actions for continuous integration, testing, and validation.

## Workflow: `.github/workflows/ci.yml`

The CI pipeline runs on every `push` and `pull_request` to the `main` branch. It consists of three primary jobs:

### 1. Backend Test (Go)
Ensures the Go backend code is formatted, statically sound, and passes all unit tests.
- **Go Format**: Fails if `gofmt` detects unformatted code.
- **Go Vet**: Analyzes code for suspicious constructs.
- **Go Test**: Executes `go test -v ./...` to validate business logic.

### 2. Frontend Test (Angular)
Ensures the frontend application builds successfully.
- **Dependencies**: Uses `npm ci` with cached node_modules for speed.
- **Build**: Compiles the Angular code for production (`npm run build`).

### 3. Infrastructure Validation (Docker & Kubernetes)
Validates that our infrastructure-as-code manifests are syntactically valid and deployable.
- **Docker Compose**: Runs `docker compose config -q` to validate the root YAML format.
- **Kubernetes Dry-Run**: Creates a dummy namespace and runs `kubectl apply -k --dry-run=client` against the Kustomize manifests to ensure all Kubernetes API objects are structurally valid.

*Note: Since this is an open-source demonstration, the CI pipeline stops at validation and does not actively deploy to a cloud provider.*
