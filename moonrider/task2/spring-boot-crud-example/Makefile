.PHONY: help build test clean docker-build docker-run docker-compose-up docker-compose-down k8s-deploy k8s-delete

# Default target
help:
	@echo "Available targets:"
	@echo "  build          - Build the Spring Boot application"
	@echo "  test           - Run tests"
	@echo "  clean          - Clean build artifacts"
	@echo "  docker-build   - Build Docker image"
	@echo "  docker-run     - Run Docker container"
	@echo "  docker-compose-up   - Start services with docker-compose"
	@echo "  docker-compose-down - Stop docker-compose services"
	@echo "  k8s-deploy     - Deploy to Kubernetes"
	@echo "  k8s-delete     - Delete Kubernetes resources"

# Build the application
build:
	mvn clean package -DskipTests

# Run tests
test:
	mvn test

# Clean build artifacts
clean:
	mvn clean

# Build Docker image
docker-build:
	docker build -t product-catalog:latest .

# Run Docker container
docker-run:
	docker run -p 8080:8080 product-catalog:latest

# Start services with docker-compose
docker-compose-up:
	docker-compose up -d

# Stop docker-compose services
docker-compose-down:
	docker-compose down

# Deploy to Kubernetes
k8s-deploy:
	kubectl apply -f k8s/v1/
	kubectl apply -f k8s/v1.1/
	kubectl apply -f k8s/v2/
	kubectl apply -f k8s/ingress.yaml

# Delete Kubernetes resources
k8s-delete:
	kubectl delete -f k8s/ingress.yaml
	kubectl delete -f k8s/v2/
	kubectl delete -f k8s/v1.1/
	kubectl delete -f k8s/v1/

# Check Kubernetes status
k8s-status:
	kubectl get pods -A
	kubectl get services -A
	kubectl get hpa -A

# Port forward for local access
k8s-port-forward-v1:
	kubectl port-forward svc/product-catalog-v1-service 8081:80 -n product-catalog-v1

k8s-port-forward-v1-1:
	kubectl port-forward svc/product-catalog-v1-1-service 8082:80 -n product-catalog-v1-1

k8s-port-forward-v2:
	kubectl port-forward svc/product-catalog-v2-service 8083:80 -n product-catalog-v2 