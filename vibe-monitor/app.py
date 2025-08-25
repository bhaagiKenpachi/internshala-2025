# -*- coding: utf-8 -*-
import time
import random
import logging
import json
import requests
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, Response
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from opentelemetry import trace
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
import uvicorn

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Simple Loki client for direct log shipping
class LokiClient:
    def __init__(self, loki_url="http://loki:3100"):
        self.loki_url = loki_url
        self.endpoint = f"{loki_url}/loki/api/v1/push"
        logger.info(f"Loki client initialized with endpoint: {self.endpoint}")
    
    def send_log(self, message, level="INFO", labels=None):
        if labels is None:
            labels = {"job": "vibe-monitor-app", "service": "fastapi"}
        
        timestamp_ns = int(datetime.now().timestamp() * 1e9)
        
        payload = {
            "streams": [
                {
                    "stream": labels,
                    "values": [
                        [str(timestamp_ns), message]
                    ]
                }
            ]
        }
        
        try:
            response = requests.post(
                self.endpoint,
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=2
            )
            if response.status_code == 204:
                logger.debug(f"Successfully sent log to Loki: {message[:50]}...")
            else:
                logger.warning(f"Failed to send log to Loki: {response.status_code}")
        except Exception as e:
            logger.warning(f"Error sending log to Loki: {e}")

# Initialize Loki client
loki_client = LokiClient()

# Initialize OpenTelemetry
trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)

# Configure Jaeger exporter
jaeger_exporter = JaegerExporter(
    agent_host_name="jaeger",
    agent_port=6831,
)
trace.get_tracer_provider().add_span_processor(
    BatchSpanProcessor(jaeger_exporter)
)

# Configure Prometheus metrics
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

REQUEST_LATENCY = Histogram(
    'http_request_duration_seconds',
    'HTTP request latency',
    ['method', 'endpoint']
)

# Create FastAPI app
app = FastAPI(title="Vibe Monitor API", version="1.0.0")

# Instrument FastAPI with OpenTelemetry
FastAPIInstrumentor.instrument_app(app)

@app.middleware("http")
async def monitor_requests(request: Request, call_next):
    start_time = time.time()
    
    # Log incoming request
    log_message = f"Incoming request: {request.method} {request.url.path}"
    logger.info(log_message)
    loki_client.send_log(log_message, level="INFO", labels={
        "job": "vibe-monitor-app",
        "service": "fastapi",
        "method": request.method,
        "endpoint": request.url.path,
        "type": "request_start"
    })
    
    # Create a span for the request
    with tracer.start_as_current_span(f"{request.method} {request.url.path}") as span:
        span.set_attribute("http.method", request.method)
        span.set_attribute("http.url", str(request.url))
        
        # Process the request
        response = await call_next(request)
        
        # Calculate latency
        latency = time.time() - start_time
        
        # Record metrics
        REQUEST_COUNT.labels(
            method=request.method,
            endpoint=request.url.path,
            status=response.status_code
        ).inc()
        
        REQUEST_LATENCY.labels(
            method=request.method,
            endpoint=request.url.path
        ).observe(latency)
        
        # Add latency to span
        span.set_attribute("http.duration", latency)
        span.set_attribute("http.status_code", response.status_code)
        
        # Log response
        log_message = f"Request completed: {request.method} {request.url.path} - Status: {response.status_code} - Latency: {latency:.3f}s"
        logger.info(log_message)
        loki_client.send_log(log_message, level="INFO", labels={
            "job": "vibe-monitor-app",
            "service": "fastapi",
            "method": request.method,
            "endpoint": request.url.path,
            "status": str(response.status_code),
            "latency": f"{latency:.3f}",
            "type": "request_complete"
        })
        
        return response

@app.on_event("startup")
async def startup_event():
    """Test Loki connection on startup"""
    try:
        response = requests.get(f"{loki_client.loki_url}/ready", timeout=5)
        if response.status_code == 200:
            logger.info("✅ Loki connection successful")
            loki_client.send_log("FastAPI application started successfully", level="INFO", labels={
                "job": "vibe-monitor-app",
                "service": "fastapi",
                "type": "startup"
            })
        else:
            logger.warning(f"⚠️ Loki connection failed: {response.status_code}")
    except Exception as e:
        logger.error(f"❌ Loki connection error: {e}")

@app.get("/")
async def root():
    logger.info("Root endpoint called")
    loki_client.send_log("Root endpoint accessed", level="INFO", labels={
        "job": "vibe-monitor-app",
        "service": "fastapi",
        "endpoint": "/",
        "type": "endpoint_access"
    })
    
    with tracer.start_as_current_span("root_operation") as span:
        span.set_attribute("operation.type", "root")
        
        # Simulate some work
        time.sleep(random.uniform(0.1, 0.5))
        
        return {"message": "Welcome to Vibe Monitor API!", "status": "healthy"}

@app.get("/health")
async def health():
    logger.info("Health check endpoint called")
    loki_client.send_log("Health check endpoint accessed", level="INFO", labels={
        "job": "vibe-monitor-app",
        "service": "fastapi",
        "endpoint": "/health",
        "type": "endpoint_access"
    })
    
    with tracer.start_as_current_span("health_check") as span:
        span.set_attribute("operation.type", "health_check")
        
        # Simulate some work
        time.sleep(random.uniform(0.05, 0.2))
        
        return {"status": "healthy", "timestamp": time.time()}

@app.get("/api/vibe")
async def get_vibe():
    logger.info("Vibe endpoint called")
    loki_client.send_log("Vibe endpoint accessed", level="INFO", labels={
        "job": "vibe-monitor-app",
        "service": "fastapi",
        "endpoint": "/api/vibe",
        "type": "endpoint_access"
    })
    
    with tracer.start_as_current_span("get_vibe") as span:
        span.set_attribute("operation.type", "get_vibe")
        
        # Simulate some work with potential errors
        time.sleep(random.uniform(0.2, 1.0))
        
        # Randomly generate some errors for demonstration
        if random.random() < 0.1:  # 10% chance of error
            error_msg = "Random error occurred in vibe endpoint"
            logger.error(error_msg)
            loki_client.send_log(error_msg, level="ERROR", labels={
                "job": "vibe-monitor-app",
                "service": "fastapi",
                "endpoint": "/api/vibe",
                "type": "error"
            })
            span.set_attribute("error", True)
            return JSONResponse(
                status_code=500,
                content={"error": "Something went wrong!", "vibe": "bad"}
            )
        
        vibes = ["amazing", "good", "okay", "meh", "awesome"]
        selected_vibe = random.choice(vibes)
        
        span.set_attribute("vibe.result", selected_vibe)
        logger.info(f"Vibe generated: {selected_vibe}")
        
        return {
            "vibe": selected_vibe,
            "confidence": random.uniform(0.5, 1.0),
            "timestamp": time.time()
        }

@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.get("/api/slow")
async def slow_endpoint():
    logger.info("Slow endpoint called")
    loki_client.send_log("Slow endpoint accessed", level="INFO", labels={
        "job": "vibe-monitor-app",
        "service": "fastapi",
        "endpoint": "/api/slow",
        "type": "endpoint_access"
    })
    
    with tracer.start_as_current_span("slow_operation") as span:
        span.set_attribute("operation.type", "slow_operation")
        
        # Simulate a slow operation
        sleep_time = random.uniform(2.0, 5.0)
        time.sleep(sleep_time)
        
        span.set_attribute("sleep.duration", sleep_time)
        logger.info(f"Slow operation completed after {sleep_time:.2f}s")
        
        return {"message": "Slow operation completed", "duration": sleep_time}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
