.PHONY: build run test clean docker-build docker-run docker-compose-up docker-compose-down

# Build the application
build:
	go build -o bin/identity-reconciliation main.go

# Run the application locally
run:
	go run main.go

# Run tests
test:
	go test -v ./...

# Run tests with coverage
test-coverage:
	go test -v -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out

# Clean build artifacts
clean:
	rm -rf bin/
	rm -f coverage.out

# Build Docker image
docker-build:
	docker build -t identity-reconciliation .

# Run Docker container
docker-run:
	docker run -p 8080:8080 -e DATABASE_URL="postgres://postgres:password@host.docker.internal:5432/identity_db?sslmode=disable" identity-reconciliation

# Start services with Docker Compose
docker-compose-up:
	docker-compose up --build

# Stop services with Docker Compose
docker-compose-down:
	docker-compose down

# Run the test script
test-api:
	./test_api.sh

# Install dependencies
deps:
	go mod download

# Format code
fmt:
	go fmt ./...

# Lint code
lint:
	golangci-lint run

# Generate go.sum
tidy:
	go mod tidy

# Help
help:
	@echo "Available commands:"
	@echo "  build           - Build the application"
	@echo "  run             - Run the application locally"
	@echo "  test            - Run tests"
	@echo "  test-coverage   - Run tests with coverage report"
	@echo "  clean           - Clean build artifacts"
	@echo "  docker-build    - Build Docker image"
	@echo "  docker-run      - Run Docker container"
	@echo "  docker-compose-up   - Start services with Docker Compose"
	@echo "  docker-compose-down - Stop services with Docker Compose"
	@echo "  test-api        - Run API test script"
	@echo "  deps            - Install dependencies"
	@echo "  fmt             - Format code"
	@echo "  lint            - Lint code"
	@echo "  tidy            - Generate go.sum"
	@echo "  help            - Show this help message" 