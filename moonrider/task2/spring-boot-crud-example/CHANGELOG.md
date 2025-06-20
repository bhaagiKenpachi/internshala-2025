# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-01-20

### Added
- Enhanced search functionality with multiple query parameters (keyword, minPrice, maxPrice, minQuantity)
- Comprehensive error handling and validation for all endpoints
- Improved response structure with proper HTTP status codes
- Enhanced input validation for product creation and updates
- Better resource management with increased CPU and memory limits

### Changed
- Updated all endpoints to return ResponseEntity with proper error handling
- Enhanced service layer with input validation and error checking
- Increased default replicas from 2 to 3 for better availability
- Updated resource limits for better performance

### Fixed
- Fixed potential null pointer exceptions in service layer
- Improved error messages for better debugging

## [1.1.0] - 2025-01-20

### Added
- Search endpoint `/products/search` with keyword-based filtering
- Basic search functionality in service layer
- Kubernetes deployment configuration for v1.1

### Changed
- Enhanced service layer with search capabilities
- Updated controller to support search operations

## [1.0.0] - 2025-01-20

### Added
- Initial release of Product Catalog Microservice
- Basic CRUD operations for products
- Health check endpoint `/health`
- Docker containerization with multi-stage build
- Kubernetes deployment configuration
- Horizontal Pod Autoscaler (HPA) configuration
- Jenkins CI/CD pipeline
- Ingress controller for routing between versions

### Features
- Create, Read, Update, Delete products
- List all products
- Find products by ID and name
- Health monitoring endpoint
- Containerized deployment
- Kubernetes orchestration
- Automated CI/CD pipeline 