#!/bin/bash

# Test script for Identity Reconciliation API (Spring Boot)
# Make sure the service is running on localhost:8080

echo "🧪 Testing Identity Reconciliation API (Spring Boot)"
echo "=================================================="

# Wait for service to be ready
echo "⏳ Waiting for service to be ready..."
until curl -s http://localhost:8080/api/v1/health > /dev/null; do
    sleep 1
done
echo "✅ Service is ready!"

echo ""
echo "📋 Test Scenario 1: New Customer (Doc's first purchase)"
echo "-------------------------------------------------------"
curl -X POST http://localhost:8080/api/v1/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "doc@example.com", "phoneNumber": "1234567890"}' \
  | jq '.'

echo ""
echo "📋 Test Scenario 2: Same Customer, New Phone Number"
echo "---------------------------------------------------"
curl -X POST http://localhost:8080/api/v1/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "doc@example.com", "phoneNumber": "0987654321"}' \
  | jq '.'

echo ""
echo "📋 Test Scenario 3: Same Customer, New Email"
echo "---------------------------------------------"
curl -X POST http://localhost:8080/api/v1/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "doc2@example.com", "phoneNumber": "1234567890"}' \
  | jq '.'

echo ""
echo "📋 Test Scenario 4: Same Customer, Completely New Contact Info"
echo "---------------------------------------------------------------"
curl -X POST http://localhost:8080/api/v1/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "doc3@example.com", "phoneNumber": "5555555555"}' \
  | jq '.'

echo ""
echo "📋 Test Scenario 5: Another Customer (Different Person)"
echo "-------------------------------------------------------"
curl -X POST http://localhost:8080/api/v1/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@example.com", "phoneNumber": "1111111111"}' \
  | jq '.'

echo ""
echo "📋 Test Scenario 6: Link Alice's New Contact Info"
echo "--------------------------------------------------"
curl -X POST http://localhost:8080/api/v1/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "alice2@example.com", "phoneNumber": "1111111111"}' \
  | jq '.'

echo ""
echo "📋 Test Scenario 7: Test Validation (Empty Email)"
echo "-------------------------------------------------"
curl -X POST http://localhost:8080/api/v1/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "", "phoneNumber": "1234567890"}' \
  | jq '.'

echo ""
echo "📋 Test Scenario 8: Test Validation (Empty Phone)"
echo "-------------------------------------------------"
curl -X POST http://localhost:8080/api/v1/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "phoneNumber": ""}' \
  | jq '.'

echo ""
echo "📋 Test Scenario 9: Test Health Endpoint"
echo "----------------------------------------"
curl -s http://localhost:8080/api/v1/health | jq '.'

echo ""
echo "✅ All tests completed!" 