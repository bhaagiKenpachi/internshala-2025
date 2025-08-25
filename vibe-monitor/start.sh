#!/bin/bash

echo "🚀 Starting Vibe Monitor Stack..."
echo "=================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start the services
echo "📦 Starting services with Docker Compose..."
docker compose up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Test the setup
echo "🧪 Testing setup..."
python test_setup.py

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📊 Access your monitoring tools:"
echo "   Grafana:    http://localhost:3000 (admin/admin)"
echo "   Prometheus: http://localhost:9090"
echo "   Jaeger:     http://localhost:16686"
echo "   FastAPI:    http://localhost:8000"
echo ""
echo "🚀 To generate traffic, run:"
echo "   python simulate_traffic.py"
echo ""
echo "🛑 To stop services, run:"
echo "   docker compose down"
