.PHONY: help build run test clean docker-build docker-run docker-stop docker-logs

# Default target
help:
	@echo "Available commands:"
	@echo "  build        - Build the application with Maven"
	@echo "  run          - Run the application locally"
	@echo "  test         - Run tests"
	@echo "  clean        - Clean build artifacts"
	@echo "  docker-build - Build Docker image"
	@echo "  docker-run   - Run with Docker Compose"
	@echo "  docker-stop  - Stop Docker Compose services"
	@echo "  docker-logs  - Show Docker logs"
	@echo "  test-api     - Run API tests"

# Build the application
build:
	@echo "Building application..."
	mvn clean compile

# Run the application locally
run:
	@echo "Running application locally..."
	mvn spring-boot:run

# Run tests
test:
	@echo "Running tests..."
	mvn test

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	mvn clean

# Build Docker image
docker-build:
	@echo "Building Docker image..."
	docker build -t identity-reconciliation:latest .

# Run with Docker Compose
docker-run:
	@echo "Starting services with Docker Compose..."
	docker-compose up --build -d

# Stop Docker Compose services
docker-stop:
	@echo "Stopping Docker Compose services..."
	docker-compose down

# Show Docker logs
docker-logs:
	@echo "Showing Docker logs..."
	docker-compose logs -f

# Test the API
test-api:
	@echo "Testing API endpoints..."
	@echo "Waiting for service to be ready..."
	@until curl -s http://localhost:8080/api/v1/health > /dev/null; do sleep 1; done
	@echo "Service is ready!"
	@echo ""
	@echo "Testing health endpoint..."
	curl -s http://localhost:8080/api/v1/health | jq '.'
	@echo ""
	@echo "Testing identify endpoint with new customer..."
	curl -s -X POST http://localhost:8080/api/v1/identify \
		-H "Content-Type: application/json" \
		-d '{"email": "doc@example.com", "phoneNumber": "1234567890"}' | jq '.'
	@echo ""
	@echo "Testing identify endpoint with same customer, new phone..."
	curl -s -X POST http://localhost:8080/api/v1/identify \
		-H "Content-Type: application/json" \
		-d '{"email": "doc@example.com", "phoneNumber": "0987654321"}' | jq '.' 