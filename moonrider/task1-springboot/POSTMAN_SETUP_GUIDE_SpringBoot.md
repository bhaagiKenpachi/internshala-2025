# Postman Setup Guide - Spring Boot Version

This guide will help you set up Postman to test the Identity Reconciliation API (Spring Boot version).

## 📋 Prerequisites

1. **Postman Desktop App** installed on your machine
2. **Spring Boot service running** on `http://localhost:8080`
3. **Docker Compose services** started (if using Docker)

## 🚀 Quick Setup

### Step 1: Import the Collection

1. Open Postman
2. Click **Import** button
3. Select the file: `Identity_Reconciliation_API_SpringBoot.postman_collection.json`
4. Click **Import**

### Step 2: Import the Environment

1. In Postman, click **Import** again
2. Select the file: `Identity_Reconciliation_Environment_SpringBoot.postman_environment.json`
3. Click **Import**

### Step 3: Select the Environment

1. In the top-right corner of Postman, click the environment dropdown
2. Select **"Identity Reconciliation Environment (Spring Boot)"**
3. Verify that `base_url` is set to `http://localhost:8080`

## 🧪 Running Tests

### Option 1: Individual Tests

1. Expand the **"Identity Reconciliation"** folder
2. Run tests in order:
   - **1. New Customer - Doc's First Purchase**
   - **2. Same Customer - New Phone Number**
   - **3. Same Customer - New Email**
   - **4. Another Customer - Alice**
   - **5. Link Alice's New Contact Info**

### Option 2: Run Entire Collection

1. Click the **"Identity Reconciliation API (Spring Boot)"** collection
2. Click the **"Run"** button (▶️)
3. Select the environment: **"Identity Reconciliation Environment (Spring Boot)"**
4. Click **"Run Identity Reconciliation API (Spring Boot)"**

## 📊 Test Scenarios

### Health Check
- **Endpoint**: `GET /api/v1/health`
- **Purpose**: Verify service is running
- **Expected**: `{"status": "healthy", "service": "Identity Reconciliation Service"}`

### Identity Reconciliation Flow

#### 1. New Customer (Doc's First Purchase)
- **Endpoint**: `POST /api/v1/identify`
- **Payload**: `{"email": "doc@example.com", "phoneNumber": "1234567890"}`
- **Expected**: New primary contact created with ID 1

#### 2. Same Customer, New Phone Number
- **Endpoint**: `POST /api/v1/identify`
- **Payload**: `{"email": "doc@example.com", "phoneNumber": "0987654321"}`
- **Expected**: Secondary contact created, linked to primary

#### 3. Same Customer, New Email
- **Endpoint**: `POST /api/v1/identify`
- **Payload**: `{"email": "doc2@example.com", "phoneNumber": "1234567890"}`
- **Expected**: Secondary contact created, linked to primary

#### 4. Another Customer (Alice)
- **Endpoint**: `POST /api/v1/identify`
- **Payload**: `{"email": "alice@example.com", "phoneNumber": "5555555555"}`
- **Expected**: New primary contact created with different ID

#### 5. Link Alice's New Contact Info
- **Endpoint**: `POST /api/v1/identify`
- **Payload**: `{"email": "alice2@example.com", "phoneNumber": "5555555555"}`
- **Expected**: Secondary contact created, linked to Alice's primary

### Validation Tests

#### Empty Email Validation
- **Endpoint**: `POST /api/v1/identify`
- **Payload**: `{"email": "", "phoneNumber": "1234567890"}`
- **Expected**: 400 Bad Request with validation error

#### Empty Phone Validation
- **Endpoint**: `POST /api/v1/identify`
- **Payload**: `{"email": "test@example.com", "phoneNumber": ""}`
- **Expected**: 400 Bad Request with validation error

## 🔧 Environment Variables

The environment includes the following variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `base_url` | `http://localhost:8080` | Base URL for the API |
| `doc_primary_contact_id` | (auto-set) | Doc's primary contact ID |
| `alice_primary_contact_id` | (auto-set) | Alice's primary contact ID |
| `test_email_1` | `doc@example.com` | Doc's first email |
| `test_phone_1` | `1234567890` | Doc's first phone |
| `test_email_2` | `doc2@example.com` | Doc's second email |
| `test_phone_2` | `0987654321` | Doc's second phone |
| `alice_email` | `alice@example.com` | Alice's email |
| `alice_phone` | `5555555555` | Alice's phone |

## 📈 Test Results

### Expected Response Format

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["doc@example.com", "doc2@example.com"],
    "phoneNumbers": ["1234567890", "0987654321"],
    "secondaryContactIds": [2, 3]
  }
}
```

### Test Assertions

Each test includes assertions for:
- **Status Code**: 200 for success, 400 for validation errors
- **Response Structure**: Valid JSON with required fields
- **Business Logic**: Correct contact linking and consolidation
- **Performance**: Response time under 5 seconds

## 🐛 Troubleshooting

### Service Not Running
```
Error: connect ECONNREFUSED 127.0.0.1:8080
```
**Solution**: Start the Spring Boot service:
```bash
cd moonrider/task1-springboot
docker-compose up --build -d
```

### Database Connection Issues
```
Error: Database connection failed
```
**Solution**: Check PostgreSQL container:
```bash
docker-compose logs postgres
```

### Validation Errors
```
Status: 400 Bad Request
```
**Solution**: Check request payload format and required fields

### Environment Variables Not Set
```
Error: base_url is undefined
```
**Solution**: Select the correct environment in Postman

## 📝 Notes

- **API Versioning**: The Spring Boot version uses `/api/v1/` prefix
- **Content-Type**: All requests use `application/json`
- **Validation**: Bean validation with custom error messages
- **Logging**: Check application logs for detailed error information

## 🔄 Differences from Go Version

| Feature | Go Version | Spring Boot Version |
|---------|------------|-------------------|
| Base URL | `http://localhost:8080` | `http://localhost:8080/api/v1` |
| Health Endpoint | `/health` | `/api/v1/health` |
| Identify Endpoint | `/identify` | `/api/v1/identify` |
| Validation | Manual | Bean validation |
| Error Handling | Custom | Global exception handler |
| Database | Raw SQL | JPA/Hibernate |

## 🎯 Next Steps

1. **Run the collection** to verify all functionality
2. **Review test results** in the Postman console
3. **Check application logs** for detailed information
4. **Modify test data** as needed for your scenarios 