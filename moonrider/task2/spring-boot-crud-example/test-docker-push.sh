#!/bin/bash

# Test script for Docker Hub push functionality
# This script can be run locally to test Docker build and push before Jenkins

set -e

# Configuration
DOCKER_IMAGE="luffybhaagi008/product-catalog"
DOCKER_TAG="test-$(date +%Y%m%d-%H%M%S)"

echo "=== Docker Hub Push Test Script ==="
echo "Image: ${DOCKER_IMAGE}"
echo "Tag: ${DOCKER_TAG}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Dockerfile exists
if [ ! -f "Dockerfile" ]; then
    echo "❌ Dockerfile not found in current directory."
    exit 1
fi

# Build the Docker image
echo "🔨 Building Docker image..."
docker build -t "${DOCKER_IMAGE}:${DOCKER_TAG}" .
docker tag "${DOCKER_IMAGE}:${DOCKER_TAG}" "${DOCKER_IMAGE}:latest"

echo "✅ Docker image built successfully"
echo ""

# Check if user is logged into Docker Hub
if ! docker info | grep -q "Username"; then
    echo "⚠️  Not logged into Docker Hub. Please run:"
    echo "   docker login"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "🔐 Logged into Docker Hub as: $(docker info | grep Username | cut -d: -f2 | xargs)"
echo ""

# Push the images
echo "📤 Pushing Docker images to Docker Hub..."
docker push "${DOCKER_IMAGE}:${DOCKER_TAG}"
docker push "${DOCKER_IMAGE}:latest"

echo ""
echo "✅ Successfully pushed images to Docker Hub:"
echo "   - ${DOCKER_IMAGE}:${DOCKER_TAG}"
echo "   - ${DOCKER_IMAGE}:latest"
echo ""

# Test pulling the image
echo "🧪 Testing image pull..."
docker pull "${DOCKER_IMAGE}:${DOCKER_TAG}"

echo ""
echo "✅ Image pull test successful!"
echo ""

# Cleanup
echo "🧹 Cleaning up local images..."
docker rmi "${DOCKER_IMAGE}:${DOCKER_TAG}" || true
docker rmi "${DOCKER_IMAGE}:latest" || true

echo ""
echo "🎉 All tests completed successfully!"
echo "Your Jenkins pipeline should work correctly with Docker Hub push." 