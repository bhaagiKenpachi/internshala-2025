#!/bin/bash

# Test script for Identity Reconciliation API
# Make sure the service is running on localhost:8080

echo "🧪 Testing Identity Reconciliation API"
echo "======================================"

# Wait for service to be ready
echo "⏳ Waiting for service to be ready..."
until curl -s http://localhost:8080/health > /dev/null; do
    sleep 1
done
echo "✅ Service is ready!"

echo ""
echo "📋 Test Scenario 1: New Customer (Doc's first purchase)"
echo "-------------------------------------------------------"
curl -X POST http://localhost:8080/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "doc@example.com", "phoneNumber": "1234567890"}' \
  | jq '.'

echo ""
echo "📋 Test Scenario 2: Same Customer, New Phone Number"
echo "---------------------------------------------------"
curl -X POST http://localhost:8080/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "doc@example.com", "phoneNumber": "0987654321"}' \
  | jq '.'

echo ""
echo "📋 Test Scenario 3: Same Customer, New Email"
echo "---------------------------------------------"
curl -X POST http://localhost:8080/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "doc2@example.com", "phoneNumber": "1234567890"}' \
  | jq '.'

echo ""
echo "📋 Test Scenario 4: Same Customer, Completely New Contact Info"
echo "---------------------------------------------------------------"
curl -X POST http://localhost:8080/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "doc3@example.com", "phoneNumber": "5555555555"}' \
  | jq '.'

echo ""
echo "📋 Test Scenario 5: Another Customer (Different Person)"
echo "-------------------------------------------------------"
curl -X POST http://localhost:8080/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@example.com", "phoneNumber": "1111111111"}' \
  | jq '.'

echo ""
echo "📋 Test Scenario 6: Link Alice's New Contact Info"
echo "-------------------------------------------------"
curl -X POST http://localhost:8080/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "alice2@example.com", "phoneNumber": "1111111111"}' \
  | jq '.'

echo ""
echo "📋 Test Scenario 7: Edge Case - Empty Request"
echo "----------------------------------------------"
curl -X POST http://localhost:8080/identify \
  -H "Content-Type: application/json" \
  -d '{}' \
  | jq '.'

echo ""
echo "📋 Test Scenario 8: Edge Case - Only Email"
echo "-------------------------------------------"
curl -X POST http://localhost:8080/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "bob@example.com"}' \
  | jq '.'

echo ""
echo "📋 Test Scenario 9: Edge Case - Only Phone Number"
echo "--------------------------------------------------"
curl -X POST http://localhost:8080/identify \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "2222222222"}' \
  | jq '.'

echo ""
echo "🎉 All tests completed!"
echo "======================" 