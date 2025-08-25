# Vibe Monitor - FastAPI Observability Stack

A complete monitoring solution for FastAPI applications with Prometheus, Grafana, Jaeger, and Loki for metrics, logs, and traces.

## 🚀 Features

- **FastAPI Service** with multiple endpoints for testing
- **Prometheus** for metrics collection
- **Grafana** for visualization with pre-configured dashboards
- **Jaeger** for distributed tracing
- **Loki** for log aggregation
- **Traffic Simulation** script for testing

## 📋 Prerequisites

- Docker and Docker Compose
- Python 3.11+ (for local development)
- curl or similar HTTP client

## 🛠️ Quick Start

### 1. Start the Monitoring Stack

```bash
# Clone or navigate to the project directory
cd vibe-monitor

# Start all services
docker-compose up -d
```

This will start:
- FastAPI service on `http://localhost:8000`
- Prometheus on `http://localhost:9090`
- Grafana on `http://localhost:3000` (admin/admin)
- Jaeger on `http://localhost:16686`
- Loki on `http://localhost:3100`

### 2. Verify Services

```bash
# Check if FastAPI is running
curl http://localhost:8000/health

# Check Prometheus metrics
curl http://localhost:8000/metrics

# Check if all containers are running
docker-compose ps
```

### 3. Generate Traffic

```bash
# Install Python dependencies for traffic simulation
pip install requests

# Run the traffic simulation script
python simulate_traffic.py
```

## 📊 Monitoring Dashboards

### Grafana Dashboard

1. Open Grafana at `http://localhost:3000`
2. Login with `admin/admin`
3. Navigate to Dashboards → Vibe Monitor Dashboard

The dashboard includes:
- Request rate over time
- Request latency (95th percentile)
- Total requests by endpoint (pie chart)
- Request latency over time (line chart)
- HTTP status codes distribution
- Error rate

### Jaeger Tracing

1. Open Jaeger at `http://localhost:16686`
2. Select the service "vibe-monitor-api"
3. Click "Find Traces" to see distributed traces

### Prometheus Metrics

1. Open Prometheus at `http://localhost:9090`
2. Go to Graph tab
3. Try these queries:
   - `rate(http_requests_total[5m])` - Request rate
   - `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))` - 95th percentile latency
   - `sum by (endpoint) (http_requests_total)` - Requests by endpoint

## 🔧 API Endpoints

The FastAPI service provides these endpoints:

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/vibe` - Returns a random vibe (with 10% error rate)
- `GET /api/slow` - Simulates slow operations (2-5 seconds)
- `GET /metrics` - Prometheus metrics

## 📈 Metrics Collected

### Request Metrics
- `http_requests_total` - Total request count by method, endpoint, and status
- `http_request_duration_seconds` - Request latency histogram

### Custom Metrics
- Request count by endpoint
- Error rates
- Response time percentiles

## 🔍 Logging

The application logs:
- Incoming requests
- Request completion with status and latency
- Errors and exceptions
- Custom application events

## 🐛 Troubleshooting

### Service Not Starting
```bash
# Check container logs
docker-compose logs app

# Check if ports are available
netstat -tulpn | grep :8000
```

### No Metrics in Prometheus
```bash
# Check if metrics endpoint is accessible
curl http://localhost:8000/metrics

# Check Prometheus targets
# Go to http://localhost:9090/targets
```

### No Traces in Jaeger
```bash
# Check Jaeger logs
docker-compose logs jaeger

# Verify OpenTelemetry configuration in app.py
```

## 🧪 Testing Scenarios

### 1. Normal Traffic
```bash
python simulate_traffic.py
# Select option 1 for continuous traffic
```

### 2. Burst Traffic
```bash
python simulate_traffic.py
# Select option 2 for burst traffic
```

### 3. Manual Testing
```bash
# Test different endpoints
curl http://localhost:8000/
curl http://localhost:8000/api/vibe
curl http://localhost:8000/api/slow
```

## 📝 Customization

### Adding New Metrics
1. Add new Prometheus metrics in `app.py`
2. Update the Grafana dashboard in `grafana/dashboards/`
3. Restart the services

### Adding New Endpoints
1. Add new endpoints in `app.py`
2. Update the traffic simulation script
3. The monitoring will automatically pick up new endpoints

### Modifying Dashboards
1. Edit `grafana/dashboards/vibe-monitor-dashboard.json`
2. Restart Grafana or import manually

## 🧹 Cleanup

```bash
# Stop all services
docker-compose down

# Remove volumes (will delete all data)
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Jaeger Documentation](https://www.jaegertracing.io/docs/)
- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)

## 🎯 Demo Recording Checklist

For the 3-5 minute screen recording, demonstrate:

1. **Service Startup** (30 seconds)
   - Show `docker-compose up -d`
   - Verify all services are running

2. **Traffic Generation** (1 minute)
   - Run `python simulate_traffic.py`
   - Show requests hitting the service

3. **Grafana Dashboard** (1-2 minutes)
   - Show metrics dashboard
   - Point out request count and latency
   - Show logs in Grafana (if configured)

4. **Jaeger Traces** (1 minute)
   - Show distributed traces
   - Follow a request through the system

5. **Prometheus** (30 seconds)
   - Show raw metrics
   - Demonstrate querying

This setup provides a complete observability stack for monitoring FastAPI applications with real-time metrics, logs, and traces!
