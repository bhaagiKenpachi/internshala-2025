# Quick Start Guide - Task 2

This guide will help you quickly test the Task 2 implementation.

## Prerequisites

- Docker and Docker Compose
- Java 8+ and Maven (for local development)
- kubectl (for Kubernetes testing)
- curl (for API testing)

## Option 1: Local Development with Docker Compose

### 1. Start the Services

```bash
cd moonrider/task2/spring-boot-crud-example
docker-compose up -d
```

This will start:
- MySQL database on port 3306
- Product Catalog service on port 8080

### 2. Wait for Services to Start

```bash
# Check if services are running
docker-compose ps

# Check logs
docker-compose logs -f product-catalog
```

### 3. Test the API

```bash
# Make the test script executable
chmod +x test_api.sh

# Run the test script
./test_api.sh
```

## Option 2: Local Development with Maven

### 1. Configure Database

Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/product_catalog
spring.datasource.username=root
spring.datasource.password=root
```

### 2. Start MySQL (if not using Docker)

```bash
# Using Docker for MySQL only
docker run -d --name mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=product_catalog \
  -p 3306:3306 \
  mysql:8.0
```

### 3. Run the Application

```bash
mvn spring-boot:run
```

### 4. Test the API

```bash
./test_api.sh
```

## Option 3: Docker Image Testing

### 1. Build Docker Image

```bash
make docker-build
```

### 2. Run Container

```bash
make docker-run
```

### 3. Test the API

```bash
./test_api.sh
```

## Option 4: Kubernetes Testing

### Prerequisites
- Kubernetes cluster (Minikube, Docker Desktop, or cloud)
- kubectl configured
- Ingress controller installed

### 1. Deploy to Kubernetes

```bash
# Deploy all versions
make k8s-deploy

# Check deployment status
make k8s-status
```

### 2. Port Forward for Local Access

```bash
# For v1.0
make k8s-port-forward-v1

# For v1.1
make k8s-port-forward-v1-1

# For v2.0
make k8s-port-forward-v2
```

### 3. Test Different Versions

```bash
# Test v1.0
./test_api.sh http://localhost:8081

# Test v1.1
./test_api.sh http://localhost:8082

# Test v2.0
./test_api.sh http://localhost:8083
```

## Manual API Testing

### Health Check
```bash
curl http://localhost:8080/health
```

### Add a Product
```bash
curl -X POST http://localhost:8080/addProduct \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","quantity":10,"price":29.99}'
```

### Get All Products
```bash
curl http://localhost:8080/products
```

### Search Products (v1.1+)
```bash
curl "http://localhost:8080/products/search?keyword=Test"
```

### Advanced Search (v2.0+)
```bash
curl "http://localhost:8080/products/search?keyword=Test&minPrice=20&maxPrice=50"
```

## Version-Specific Features

### v1.0 Features
- Basic CRUD operations
- Health endpoint
- Simple error handling

### v1.1 Features
- All v1.0 features
- Keyword search functionality
- Enhanced service layer

### v2.0 Features
- All v1.1 features
- Advanced search with multiple parameters
- Comprehensive error handling
- Input validation
- Enhanced response structure

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check if MySQL is running
   docker-compose ps
   
   # Check MySQL logs
   docker-compose logs mysql
   ```

2. **Application Won't Start**
   ```bash
   # Check application logs
   docker-compose logs product-catalog
   
   # Check if port 8080 is available
   lsof -i :8080
   ```

3. **Kubernetes Deployment Issues**
   ```bash
   # Check pod status
   kubectl get pods -A
   
   # Check pod logs
   kubectl logs <pod-name> -n <namespace>
   
   # Check service status
   kubectl get services -A
   ```

### Useful Commands

```bash
# Clean up Docker resources
docker-compose down -v
docker system prune -f

# Clean up Kubernetes resources
make k8s-delete

# Check application health
curl -f http://localhost:8080/health

# View application metrics (if available)
curl http://localhost:8080/actuator/metrics
```

## Next Steps

1. **Set up Jenkins CI/CD**: Follow `JENKINS_SETUP.md`
2. **Configure Monitoring**: Set up Prometheus and Grafana
3. **Implement Security**: Configure RBAC and network policies
4. **Scale the Application**: Test auto-scaling with load testing

## Support

For detailed documentation, see:
- `README.md` - Complete setup guide
- `SYSTEM_DESIGN.md` - Architecture documentation
- `JENKINS_SETUP.md` - CI/CD setup guide
- `CHANGELOG.md` - Version history 