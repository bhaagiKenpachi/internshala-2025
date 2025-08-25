#!/bin/bash

echo "🔍 Testing Loki Log Aggregation..."
echo "=================================="

# Check if Loki is running
if docker ps --format "table {{.Names}}" | grep -q "vibe-monitor-loki-1"; then
    echo "✅ Loki container is running"
else
    echo "❌ Loki container is not running"
    exit 1
fi

# Check if Promtail is running
if docker ps --format "table {{.Names}}" | grep -q "vibe-monitor-promtail-1"; then
    echo "✅ Promtail container is running"
else
    echo "❌ Promtail container is not running"
    exit 1
fi

# Check Loki health
echo ""
echo "🌐 Checking Loki accessibility..."
if curl -s http://localhost:3100/ready > /dev/null; then
    echo "✅ Loki is accessible at http://localhost:3100"
else
    echo "❌ Loki is not accessible"
    exit 1
fi

# Check Loki metrics
echo ""
echo "📊 Checking Loki metrics..."
if curl -s http://localhost:3100/metrics | grep -q "loki_build_info"; then
    echo "✅ Loki metrics endpoint is working"
else
    echo "❌ Loki metrics endpoint is not working"
fi

# Check if logs are being collected
echo ""
echo "📝 Checking log collection..."
sleep 5
if curl -s "http://localhost:3100/loki/api/v1/labels" | grep -q "job"; then
    echo "✅ Log labels are available"
else
    echo "⚠️  No log labels found yet (this is normal if no logs have been sent)"
fi

# Generate some test logs
echo ""
echo "🚀 Generating test logs..."
docker compose logs app | head -5

echo ""
echo "🎯 Loki Access Instructions:"
echo "============================"
echo "1. Loki UI: http://localhost:3100"
echo "2. Loki API: http://localhost:3100/loki/api/v1/"
echo ""
echo "3. In Grafana (http://localhost:3001):"
echo "   - Go to Configuration → Data Sources"
echo "   - Add Loki data source:"
echo "     URL: http://loki:3100"
echo "   - Or use the pre-configured Loki data source"
echo ""
echo "4. Query logs in Grafana:"
echo "   - Go to Explore"
echo "   - Select Loki data source"
echo "   - Use queries like:"
echo "     {job=\"vibe-monitor\"}"
echo "     {container_name=\"vibe-monitor-app-1\"}"
echo ""
echo "🔧 Troubleshooting:"
echo "=================="
echo "If logs are not visible:"
echo "1. Check Loki logs: docker compose logs loki"
echo "2. Check Promtail logs: docker compose logs promtail"
echo "3. Restart services: docker compose restart loki promtail"
echo "4. Generate more traffic: ./run_in_container.sh traffic"
