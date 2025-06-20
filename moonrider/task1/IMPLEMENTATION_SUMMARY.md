# Task 1 Implementation Summary: Identity Reconciliation Service

## 🎯 Problem Solved

Successfully implemented a Go-based REST API service that solves the identity reconciliation challenge for Moonrider's integration with Zamazon.com. The service can link different contact information (emails and phone numbers) used by the same individual, like Dr. Chandrashekar who uses different contact details for each purchase to maintain anonymity.

## 🏗️ Architecture Overview

### Technology Stack
- **Language**: Go 1.21
- **Framework**: Gorilla Mux for HTTP routing
- **Database**: PostgreSQL with proper indexing
- **Containerization**: Docker with multi-stage builds
- **API**: RESTful JSON endpoints

### Key Components
1. **Main Application** (`main.go`): Core business logic and HTTP handlers
2. **Database Schema**: Optimized contacts table with proper relationships
3. **Docker Configuration**: Production-ready containerization
4. **Testing**: Comprehensive test scenarios and unit tests

## 🔧 Core Features Implemented

### 1. Identity Reconciliation Logic
- **Primary Contact Creation**: Creates new primary contacts for first-time customers
- **Secondary Contact Linking**: Links new contact information to existing customers
- **Smart Matching**: Matches contacts by email OR phone number
- **Data Consolidation**: Aggregates all contact information in responses

### 2. Database Design
```sql
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20),
    email VARCHAR(255),
    linked_id INTEGER REFERENCES contacts(id),
    link_precedence VARCHAR(10) CHECK (link_precedence IN ('primary', 'secondary')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);
```

**Optimizations:**
- Indexes on email, phone_number, and linked_id for fast queries
- Proper foreign key constraints
- Soft delete capability

### 3. API Endpoints

#### Health Check
```http
GET /health
Response: {"status": "healthy"}
```

#### Identity Reconciliation
```http
POST /identify
Content-Type: application/json

Request:
{
  "email": "doc@example.com",
  "phoneNumber": "1234567890"
}

Response:
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["doc@example.com", "doc2@example.com"],
    "phoneNumbers": ["1234567890", "0987654321"],
    "secondaryContactIds": [2, 3]
  }
}
```

## 🧪 Testing Results

### Scenario 1: New Customer
- **Input**: `{"email": "doc@example.com", "phoneNumber": "1234567890"}`
- **Result**: Creates primary contact with ID 1

### Scenario 2: Same Customer, New Phone Number
- **Input**: `{"email": "doc@example.com", "phoneNumber": "0987654321"}`
- **Result**: Creates secondary contact linked to primary

### Scenario 3: Same Customer, New Email
- **Input**: `{"email": "doc2@example.com", "phoneNumber": "1234567890"}`
- **Result**: Creates secondary contact linked to primary

### Scenario 4: Different Customer
- **Input**: `{"email": "alice@example.com", "phoneNumber": "5555555555"}`
- **Result**: Creates new primary contact

### Edge Cases Handled
- Empty requests (400 Bad Request)
- Only email provided
- Only phone number provided
- Invalid JSON (400 Bad Request)

## 🚀 Deployment & Operations

### Quick Start
```bash
# Start services
docker compose up --build -d

# Test the API
curl http://localhost:8080/health
curl -X POST http://localhost:8080/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "phoneNumber": "1234567890"}'
``` 