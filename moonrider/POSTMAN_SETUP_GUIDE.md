# Postman Setup Guide for Identity Reconciliation API

## 📋 Overview

This guide provides step-by-step instructions for setting up and using the Postman collection to test the Identity Reconciliation API. The collection includes comprehensive test scenarios, automated tests, and environment variables.

## 🚀 Quick Setup

### 1. Import the Collection

1. **Open Postman**
2. **Click "Import"** in the top left corner
3. **Select the file**: `Identity_Reconciliation_API.postman_collection.json`
4. **Click "Import"** to add the collection

### 2. Import the Environment

1. **Click "Import"** again
2. **Select the file**: `Identity_Reconciliation_Environment.postman_environment.json`
3. **Click "Import"** to add the environment
4. **Select the environment** from the dropdown in the top right corner

### 3. Start the API Service

```bash
# Start the services
docker compose up --build -d

# Verify the service is running
curl http://localhost:8080/health
```

## 📚 Collection Structure

### 🏥 Health Check
- **Endpoint**: `GET /health`
- **Purpose**: Verify service is running
- **Tests**: Status code, response structure, response time

### 🔍 Identity Reconciliation
Contains 5 sequential test scenarios:

#### 1. New Customer - Doc's First Purchase
- **Purpose**: Creates a new primary contact
- **Expected**: New contact with ID 1
- **Stores**: Primary contact ID in environment variable

#### 2. Same Customer - New Phone Number
- **Purpose**: Links new phone to existing contact
- **Expected**: Secondary contact created, linked to primary
- **Validates**: Same primary ID, both phone numbers included

#### 3. Same Customer - New Email
- **Purpose**: Links new email to existing contact
- **Expected**: Secondary contact created, linked to primary
- **Validates**: Same primary ID, both emails included

#### 4. Different Customer - Alice
- **Purpose**: Creates separate primary contact
- **Expected**: New primary contact with different ID
- **Stores**: Alice's primary contact ID

#### 5. Link Alice's New Contact Info
- **Purpose**: Links new info to Alice's contact
- **Expected**: Secondary contact linked to Alice's primary
- **Validates**: Same primary ID as Alice, both emails included

### ⚠️ Edge Cases & Error Handling
Tests for error scenarios:

#### Empty Request
- **Purpose**: Test validation for empty JSON
- **Expected**: 400 Bad Request
- **Validates**: Error message contains "required"

#### Only Email Provided
- **Purpose**: Test partial data handling
- **Expected**: 200 OK with empty phone number
- **Validates**: Email included, phone array exists

#### Only Phone Number Provided
- **Purpose**: Test partial data handling
- **Expected**: 200 OK with empty email
- **Validates**: Phone included, email array exists

#### Invalid JSON
- **Purpose**: Test malformed JSON handling
- **Expected**: 400 Bad Request
- **Validates**: Error message contains "Invalid"

### ⚡ Performance Tests
Tests for performance requirements:

#### Response Time Test
- **Purpose**: Verify acceptable response times
- **Expected**: Response time < 1000ms
- **Validates**: Performance requirements

## 🔧 Environment Variables

### Base Configuration
| Variable | Default Value | Description |
|----------|---------------|-------------|
| `base_url` | `http://localhost:8080` | API base URL |

### Test Data
| Variable | Value | Description |
|----------|-------|-------------|
| `test_email_1` | `doc@example.com` | Doc's primary email |
| `test_phone_1` | `1234567890` | Doc's primary phone |
| `test_email_2` | `doc2@example.com` | Doc's secondary email |
| `test_phone_2` | `0987654321` | Doc's secondary phone |
| `alice_email` | `alice@example.com` | Alice's email |
| `alice_phone` | `5555555555` | Alice's phone |
| `bob_email` | `bob@example.com` | Bob's email |
| `bob_phone` | `2222222222` | Bob's phone |

### Dynamic Variables
| Variable | Description | Set By |
|----------|-------------|--------|
| `doc_primary_contact_id` | Doc's primary contact ID | Test 1 |
| `alice_primary_contact_id` | Alice's primary contact ID | Test 4 |

## 🧪 Running Tests

### Individual Test
1. **Select the test** from the collection
2. **Click "Send"** to execute
3. **Review results** in the response tab
4. **Check test results** in the Test Results tab

### Run All Tests
1. **Right-click** on the collection
2. **Select "Run collection"**
3. **Choose environment** (Identity Reconciliation Environment)
4. **Click "Run Identity Reconciliation API"**
5. **Review results** in the collection runner

### Automated Test Run
```bash
# Using Newman (Postman CLI)
newman run Identity_Reconciliation_API.postman_collection.json \
  -e Identity_Reconciliation_Environment.postman_environment.json \
  --reporters cli,json \
  --reporter-json-export results.json
```

## 📊 Test Results Interpretation

### ✅ Successful Tests
- **Status Code**: 200 for successful operations, 400 for validation errors
- **Response Structure**: Valid JSON with expected properties
- **Data Validation**: Correct contact linking and consolidation
- **Performance**: Response time within acceptable limits

### ❌ Failed Tests
- **Status Code**: Unexpected HTTP status codes
- **Response Structure**: Missing or incorrect JSON properties
- **Data Validation**: Incorrect contact linking or missing data
- **Performance**: Response time exceeds limits

## 🔄 Test Scenarios Explained

### Scenario 1: New Customer Creation
```json
Request:
{
  "email": "doc@example.com",
  "phoneNumber": "1234567890"
}

Expected Response:
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["doc@example.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": null
  }
}
```

### Scenario 2: Contact Linking
```json
Request:
{
  "email": "doc@example.com",
  "phoneNumber": "0987654321"
}

Expected Response:
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["doc@example.com"],
    "phoneNumbers": ["1234567890", "0987654321"],
    "secondaryContactIds": [2]
  }
}
```

## 🛠️ Customization

### Adding New Test Cases
1. **Duplicate existing request**
2. **Modify request body** with new test data
3. **Update test scripts** for new expectations
4. **Add to appropriate folder** in collection

### Modifying Environment Variables
1. **Open environment** in Postman
2. **Add or modify variables**
3. **Save environment**
4. **Update collection** to use new variables

### Creating Different Environments
1. **Duplicate environment** for staging/production
2. **Update base_url** to target environment
3. **Modify test data** if needed
4. **Save as new environment**

## 📈 Performance Monitoring

### Response Time Thresholds
- **Health Check**: < 2000ms
- **Identify Endpoint**: < 1000ms
- **Global**: < 5000ms

### Monitoring Setup
1. **Enable response time tracking** in collection settings
2. **Set up alerts** for slow responses
3. **Export results** for analysis
4. **Track trends** over time

## 🔍 Debugging

### Common Issues
1. **Service not running**: Check Docker containers
2. **Database connection**: Verify PostgreSQL is running
3. **Port conflicts**: Ensure port 8080 is available
4. **Environment variables**: Check environment selection

### Debug Steps
1. **Run health check** first
2. **Check service logs**: `docker compose logs app`
3. **Verify database**: `docker compose exec db psql -U postgres -d identity_db -c "SELECT * FROM contacts;"`
4. **Test manually**: Use curl commands from README

## 📝 Best Practices

### Test Organization
- **Group related tests** in folders
- **Use descriptive names** for requests
- **Add detailed descriptions** for each test
- **Maintain test order** for dependent scenarios

### Environment Management
- **Use separate environments** for different stages
- **Keep sensitive data** in environment variables
- **Version control** environment files
- **Document environment setup** requirements

### Test Maintenance
- **Update tests** when API changes
- **Review test results** regularly
- **Add new edge cases** as discovered
- **Maintain test data** consistency

## 🎯 Success Criteria

### All Tests Passing
- ✅ Health check returns 200
- ✅ Identity reconciliation works correctly
- ✅ Contact linking functions properly
- ✅ Error handling works as expected
- ✅ Performance meets requirements

### Database State Verification
After running all tests, the database should contain:
- Primary contacts for different customers
- Secondary contacts linked to primaries
- Proper relationship structure
- No orphaned records

## 📞 Support

For issues with the Postman collection:
1. **Check service logs** for API errors
2. **Verify environment variables** are set correctly
3. **Test manually** with curl commands
4. **Review API documentation** in README.md

---

**Happy Testing! 🚀** 