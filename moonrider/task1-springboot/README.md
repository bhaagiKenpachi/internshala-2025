# Task 1: Identity Reconciliation Service (Spring Boot)

A Spring Boot-based REST API service that solves the identity reconciliation challenge for Moonrider's integration with Zamazon.com. The service can link different contact information (emails and phone numbers) used by the same individual, like Dr. Chandrashekar who uses different contact details for each purchase to maintain anonymity.

## 🎯 Problem Solved

Dr. Chandrashekar uses different email addresses and phone numbers for each purchase on Zamazon.com to maintain anonymity. Moonrider needs to link these different contact details to provide personalized customer experiences.

## 🏗️ Architecture Overview

### Technology Stack
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: PostgreSQL with JPA/Hibernate
- **Containerization**: Docker with multi-stage builds
- **API**: RESTful JSON endpoints with validation
- **Testing**: JUnit 5 with Mockito

### Key Components
1. **Controller Layer**: REST endpoints for API requests
2. **Service Layer**: Core business logic for identity reconciliation
3. **Repository Layer**: Data access with Spring Data JPA
4. **Entity Layer**: JPA entities for database mapping
5. **DTO Layer**: Data transfer objects for API requests/responses

## 🔧 Core Features Implemented

### 1. Identity Reconciliation Logic
- **Primary Contact Creation**: Creates new primary contacts for first-time customers
- **Secondary Contact Linking**: Links new contact information to existing customers
- **Smart Matching**: Matches contacts by email OR phone number
- **Data Consolidation**: Aggregates all contact information in responses

### 2. Database Design
```sql
CREATE TABLE contacts (
    id BIGSERIAL PRIMARY KEY,
    phone_number VARCHAR(20),
    email VARCHAR(255),
    linked_id BIGINT REFERENCES contacts(id),
    link_precedence VARCHAR(10) CHECK (link_precedence IN ('PRIMARY', 'SECONDARY')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);
```

**Features:**
- Automatic schema generation with Hibernate
- Proper foreign key constraints
- Soft delete capability
- Timestamp tracking

### 3. API Endpoints

#### Health Check
```http
GET /api/v1/health
Response: {"status": "healthy", "service": "Identity Reconciliation Service"}
```

#### Identity Reconciliation
```http
POST /api/v1/identify
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

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Docker and Docker Compose
- PostgreSQL (if running locally)

### Option 1: Docker Compose (Recommended)

```bash
# Navigate to the project directory
cd moonrider/task1-springboot

# Start all services
docker-compose up --build -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f identity-service
```

### Option 2: Local Development

```bash
# Navigate to the project directory
cd moonrider/task1-springboot

# Build the application
mvn clean compile

# Run the application
mvn spring-boot:run
```

### Option 3: Using Makefile

```bash
# Navigate to the project directory
cd moonrider/task1-springboot

# View available commands
make help

# Start with Docker Compose
make docker-run

# Test the API
make test-api

# Stop services
make docker-stop
```

## 🧪 Testing

### Automated API Tests
```bash
# Run the comprehensive test script
./test_api.sh
```

### Unit Tests
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=IdentityReconciliationServiceTest
```

### Manual Testing with curl

```bash
# Health check
curl http://localhost:8080/api/v1/health

# New customer
curl -X POST http://localhost:8080/api/v1/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "doc@example.com", "phoneNumber": "1234567890"}'

# Same customer, new phone
curl -X POST http://localhost:8080/api/v1/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "doc@example.com", "phoneNumber": "0987654321"}'
```

## 📋 Test Scenarios

### Scenario 1: New Customer (Doc's first purchase)
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
- Empty email or phone number (400 Bad Request)
- Invalid JSON (400 Bad Request)
- Database connection issues (500 Internal Server Error)

## 🏗️ Project Structure

```
task1-springboot/
├── src/
│   ├── main/
│   │   ├── java/com/moonrider/identityreconciliation/
│   │   │   ├── controller/
│   │   │   │   └── IdentityController.java
│   │   │   ├── service/
│   │   │   │   └── IdentityReconciliationService.java
│   │   │   ├── repository/
│   │   │   │   └── ContactRepository.java
│   │   │   ├── entity/
│   │   │   │   └── Contact.java
│   │   │   ├── dto/
│   │   │   │   ├── IdentifyRequest.java
│   │   │   │   └── IdentifyResponse.java
│   │   │   ├── exception/
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   └── IdentityReconciliationApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/com/moonrider/identityreconciliation/
│           ├── IdentityReconciliationApplicationTests.java
│           └── service/
│               └── IdentityReconciliationServiceTest.java
├── pom.xml
├── Dockerfile
├── docker-compose.yml
├── Makefile
├── test_api.sh
└── README.md
```

## 🔧 Configuration

### Application Properties
```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/identity_db
spring.datasource.username=postgres
spring.datasource.password=password

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### Environment Variables
```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/identity_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=password

# JPA
SPRING_JPA_HIBERNATE_DDL_AUTO=update
```

## 🐳 Docker Configuration

### Multi-stage Build
- **Build Stage**: Maven build with dependency caching
- **Production Stage**: OpenJDK 17 JRE with Alpine Linux
- **Security**: Non-root user execution
- **Health Checks**: Built-in health monitoring

### Docker Compose Services
- **PostgreSQL**: Database with persistent storage
- **Identity Service**: Spring Boot application
- **Health Checks**: Automatic service monitoring

## 📊 Monitoring and Logging

### Health Checks
- **Application Health**: `/api/v1/health` endpoint
- **Docker Health**: Built into container
- **Database Health**: PostgreSQL readiness check

### Logging
- **Structured Logging**: JSON-formatted logs
- **SQL Logging**: Hibernate SQL queries (debug mode)
- **Application Logs**: Business logic logging

## 🔒 Security Features

- **Input Validation**: Bean validation with custom error messages
- **SQL Injection Protection**: JPA/Hibernate parameterized queries
- **Container Security**: Non-root user execution
- **Error Handling**: Secure error messages without sensitive data

## 🚀 Performance Optimizations

- **Connection Pooling**: HikariCP for database connections
- **JPA Optimizations**: Lazy loading and proper fetch strategies
- **Caching**: Spring Boot's built-in caching mechanisms
- **Resource Limits**: Docker container resource constraints

## 🔄 API Versioning

The API is versioned at `/api/v1/` to allow for future enhancements while maintaining backward compatibility.

## 📝 Development Workflow

1. **Local Development**: Use `mvn spring-boot:run` for quick iteration
2. **Testing**: Run `mvn test` for unit tests
3. **Integration Testing**: Use `./test_api.sh` for API tests
4. **Docker Testing**: Use `docker-compose up` for full stack testing
5. **Production**: Use Docker images for deployment

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Add unit tests for new functionality
3. Update documentation for API changes
4. Use meaningful commit messages

## 📄 License

This project is part of the Internsala 2025 Cloud and Backend Assignment. 