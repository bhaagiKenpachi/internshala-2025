# Internsala 2025 - Cloud and Backend Assignment

This repository contains the implementation of the Cloud and Backend Assignment for Internsala 2025.

## 📁 Project Structure

```
internsala-2025/
├── moonrider/                    # Task 1 Implementation
│   ├── main.go                   # Go application source code
│   ├── go.mod                    # Go module dependencies
│   ├── go.sum                    # Go dependency checksums
│   ├── Dockerfile                # Docker container configuration
│   ├── docker-compose.yml        # Local development setup
│   ├── README.md                 # Detailed implementation documentation
│   ├── test_api.sh               # Automated API test script
│   ├── main_test.go              # Unit tests
│   ├── Makefile                  # Development commands
│   ├── .gitignore                # Git ignore rules
│   ├── IMPLEMENTATION_SUMMARY.md # Implementation overview
│   ├── Identity_Reconciliation_API.postman_collection.json      # Postman collection
│   ├── Identity_Reconciliation_Environment.postman_environment.json # Postman environment
│   ├── POSTMAN_SETUP_GUIDE.md    # Postman setup instructions
│   └── Cloud and Backend Assignment.pdf # Original assignment document
└── README.md                     # This file
```

## 🎯 Assignment Overview

### Task 1: Backend - Identity Reconciliation ✅ COMPLETED

**Problem**: Dr. Chandrashekar uses different email addresses and phone numbers for each purchase on Zamazon.com to maintain anonymity. Moonrider needs to link these different contact details to provide personalized customer experiences.

**Solution**: A Go-based REST API service that can:
- Process JSON payloads with email and phone number fields
- Create primary contacts for new customers
- Link secondary contacts to existing customers
- Consolidate contact information across multiple purchases
- Handle edge cases and error scenarios

**Implementation**: Located in the `moonrider/` folder

### Task 2: DevOps - Containerization, Version Control, and Scalable Deployment

**Status**: Not yet implemented

**Requirements**:
- Containerize microservice with Docker
- Implement version management with Git
- Deploy to Kubernetes with scalability
- Automate CI/CD pipelines
- Implement monitoring and logging

## 🚀 Quick Start

### For Task 1 (Identity Reconciliation)

```bash
# Navigate to the moonrider folder
cd moonrider

# Start the services
docker compose up --build -d

# Test the API
curl http://localhost:8080/health
curl -X POST http://localhost:8080/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "phoneNumber": "1234567890"}'
```

### For Postman Testing

1. Import the Postman collection: `moonrider/Identity_Reconciliation_API.postman_collection.json`
2. Import the environment: `moonrider/Identity_Reconciliation_Environment.postman_environment.json`
3. Follow the setup guide: `moonrider/POSTMAN_SETUP_GUIDE.md`

## 📚 Documentation

- **Implementation Details**: See `moonrider/README.md`
- **API Documentation**: See `moonrider/README.md#api-documentation`
- **Postman Setup**: See `moonrider/POSTMAN_SETUP_GUIDE.md`
- **Implementation Summary**: See `moonrider/IMPLEMENTATION_SUMMARY.md`
- **Original Assignment**: See `moonrider/Cloud and Backend Assignment.pdf`

## 🛠️ Technology Stack

### Task 1 (Completed)
- **Language**: Go 1.21
- **Framework**: Gorilla Mux
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose
- **Testing**: Postman Collection, Unit Tests, Integration Tests

### Task 2 (Planned)
- **Containerization**: Docker
- **Orchestration**: Kubernetes/Minikube
- **CI/CD**: GitHub Actions or Jenkins
- **Monitoring**: Prometheus & Grafana
- **Infrastructure**: Terraform

## 🧪 Testing

### Automated Tests
```bash
cd moonrider
./test_api.sh
```

### Unit Tests
```bash
cd moonrider
go test -v ./...
```

### Postman Tests
1. Import the collection and environment
2. Run the collection in Postman
3. Review test results

## 📊 Project Status

| Task | Status | Completion |
|------|--------|------------|
| Task 1: Backend Identity Reconciliation | ✅ Complete | 100% |
| Task 2: DevOps & Containerization | ⏳ Not Started | 0% |

## 🎯 Next Steps

1. **Task 2 Implementation**: Begin DevOps task implementation
2. **Enhancement**: Add authentication and authorization
3. **Monitoring**: Implement comprehensive logging and metrics
4. **Documentation**: Add API documentation with Swagger
5. **Testing**: Expand test coverage

## 📞 Support

For questions or issues:
1. Check the documentation in the `moonrider/` folder
2. Review the implementation summary
3. Test with the provided Postman collection
4. Check service logs for debugging

---

**Repository**: [GitHub Link]
**Assignment**: Cloud and Backend Assignment - Internsala 2025 