# Product Catalog Microservice

A Spring Boot-based microservice for managing product catalogs with multiple versions, containerization, and Kubernetes deployment.

## Features

- **CRUD Operations**: Create, Read, Update, Delete products
- **Search Functionality**: Search products by keyword and filters
- **Health Monitoring**: Health check endpoint for monitoring
- **Containerization**: Docker multi-stage build for production readiness
- **Kubernetes Deployment**: Multi-version deployment with namespace isolation
- **Auto-scaling**: Horizontal Pod Autoscaler (HPA) for scalability
- **CI/CD Pipeline**: Jenkins pipeline for automated deployment

## Version History

- **v1.0**: Basic CRUD operations with health endpoint
- **v1.1**: Added search functionality with keyword filtering
- **v2.0**: Enhanced search with multiple query parameters and comprehensive error handling

## Prerequisites

- Java 8 or higher
- Maven 3.6+
- Docker
- Kubernetes cluster (Minikube, Docker Desktop, or cloud provider)
- Jenkins (for CI/CD)

## Local Development

### Running the Application

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd spring-boot-crud-example
   ```

2. **Configure database**:
   Update `src/main/resources/application.properties` with your database configuration:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/product_catalog
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```

4. **Access the application**:
   - Health check: http://localhost:8080/health
   - Products: http://localhost:8080/products

### API Endpoints

#### v1.0 Endpoints
- `GET /health` - Health check
- `GET /products` - Get all products
- `POST /addProduct` - Add a product
- `POST /addProducts` - Add multiple products
- `GET /productById/{id}` - Get product by ID
- `GET /product/{name}` - Get product by name
- `PUT /update` - Update a product
- `DELETE /delete/{id}` - Delete a product

#### v1.1 Endpoints (includes v1.0 +)
- `GET /products/search?keyword={keyword}` - Search products by keyword

#### v2.0 Endpoints (includes v1.1 +)
- `GET /products/search?keyword={keyword}&minPrice={price}&maxPrice={price}&minQuantity={qty}` - Advanced search

## Docker Deployment

### Building the Docker Image

```bash
# Build the image
docker build -t product-catalog:latest .

# Run the container
docker run -p 8080:8080 product-catalog:latest
```

### Multi-stage Build Features

- **Build Stage**: Maven build with dependency caching
- **Production Stage**: Alpine-based JRE for minimal size
- **Security**: Non-root user execution
- **Health Checks**: Built-in health monitoring

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (Minikube, Docker Desktop, or cloud provider)
- kubectl configured
- Ingress controller (NGINX, Traefik)

### Deploying All Versions

1. **Create namespaces and deploy v1.0**:
   ```bash
   kubectl apply -f k8s/v1/
   ```

2. **Deploy v1.1**:
   ```bash
   kubectl apply -f k8s/v1.1/
   ```

3. **Deploy v2.0**:
   ```bash
   kubectl apply -f k8s/v2/
   ```

4. **Deploy Ingress**:
   ```bash
   kubectl apply -f k8s/ingress.yaml
   ```

### Accessing Different Versions

- **v1.0**: http://product-catalog.local/v1
- **v1.1**: http://product-catalog.local/v1.1
- **v2.0**: http://product-catalog.local/v2

### Scaling

Each version has its own Horizontal Pod Autoscaler:
- **v1.0**: 2-10 replicas
- **v1.1**: 2-10 replicas
- **v2.0**: 3-15 replicas

## CI/CD Pipeline (Jenkins)

### Prerequisites

- Jenkins server with required plugins:
  - Pipeline
  - Docker Pipeline
  - Kubernetes CLI
  - Credentials Binding

### Jenkins Credentials

Configure the following credentials in Jenkins:
- `dockerhub-credentials`: Docker Hub username/password
- `kubeconfig`: Kubernetes configuration file

### Pipeline Features

1. **Build**: Maven build with dependency management
2. **Test**: Unit and integration tests
3. **Docker Build**: Multi-stage Docker image creation
4. **Docker Push**: Push to Docker Hub registry
5. **Kubernetes Deploy**: Deploy to appropriate namespace based on branch
6. **Integration Tests**: Post-deployment health checks

### Branch Strategy

- `main` branch → deploys to v1.0 namespace
- `v1.1` branch → deploys to v1.1 namespace
- `v2.0` branch → deploys to v2.0 namespace

## Monitoring and Logging

### Health Checks

All versions include:
- **Liveness Probe**: `/health` endpoint
- **Readiness Probe**: `/health` endpoint
- **Docker Health Check**: Built into container

### Resource Monitoring

- **CPU Limits**: 250m-1000m per pod
- **Memory Limits**: 256Mi-1Gi per pod
- **Auto-scaling**: Based on CPU and memory utilization

## Security Features

- **Non-root User**: Container runs as non-root user
- **Resource Limits**: CPU and memory limits enforced
- **Network Policies**: Namespace isolation
- **Health Checks**: Built-in security monitoring

## Troubleshooting

### Common Issues

1. **Database Connection**:
   - Verify database credentials in application.properties
   - Ensure database is accessible from Kubernetes pods

2. **Kubernetes Deployment**:
   - Check pod status: `kubectl get pods -n <namespace>`
   - View logs: `kubectl logs <pod-name> -n <namespace>`

3. **Docker Build**:
   - Ensure Docker daemon is running
   - Check Docker Hub credentials

### Useful Commands

```bash
# Check pod status
kubectl get pods -A

# View logs
kubectl logs -f <pod-name> -n <namespace>

# Port forward for local access
kubectl port-forward svc/<service-name> 8080:80 -n <namespace>

# Check HPA status
kubectl get hpa -A
```