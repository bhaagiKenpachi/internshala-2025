#!/bin/bash

echo "🔍 Checking Grafana Dashboard Status..."
echo "======================================"

# Check if Grafana is running
if docker ps --format "table {{.Names}}" | grep -q "vibe-monitor-grafana-1"; then
    echo "✅ Grafana container is running"
else
    echo "❌ Grafana container is not running"
    exit 1
fi

# Check Grafana health
echo ""
echo "🌐 Checking Grafana accessibility..."
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Grafana is accessible at http://localhost:3001"
else
    echo "❌ Grafana is not accessible"
    exit 1
fi

# Check if dashboard exists
echo ""
echo "📊 Checking dashboard provisioning..."
DASHBOARD_STATUS=$(docker compose logs grafana | grep -E "(finished to provision dashboards|failed to load dashboard)" | tail -1)

if echo "$DASHBOARD_STATUS" | grep -q "finished to provision dashboards"; then
    echo "✅ Dashboard provisioning completed successfully"
elif echo "$DASHBOARD_STATUS" | grep -q "failed to load dashboard"; then
    echo "❌ Dashboard provisioning failed"
    echo "Error: $DASHBOARD_STATUS"
else
    echo "⚠️  Dashboard status unclear"
fi

echo ""
echo "🎯 Access Instructions:"
echo "======================"
echo "1. Open Grafana: http://localhost:3001"
echo "2. Login with:"
echo "   Username: admin"
echo "   Password: admin"
echo ""
echo "3. Navigate to:"
echo "   Dashboards → Vibe Monitor Dashboard"
echo ""
echo "4. If dashboard is not visible:"
echo "   - Go to Dashboards → Browse"
echo "   - Look for 'Vibe Monitor Dashboard'"
echo "   - Or create a new dashboard manually"
echo ""
echo "5. Alternative: Import dashboard manually"
echo "   - Go to Dashboards → Import"
echo "   - Upload: grafana/dashboards/vibe-monitor-dashboard.json"
echo ""
echo "🔧 Troubleshooting:"
echo "=================="
echo "If dashboard is not visible:"
echo "1. Check logs: docker compose logs grafana"
echo "2. Restart Grafana: docker compose restart grafana"
echo "3. Rebuild: docker compose build grafana && docker compose up -d grafana"
