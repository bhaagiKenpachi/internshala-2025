#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import requests
import time
import sys
import os

def test_service():
    """Test if the FastAPI service is running and responding"""
    try:
        print("Testing FastAPI service...")
        # Use localhost since we're inside the container
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("FastAPI service is running")
            return True
        else:
            print(f"FastAPI service returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"Cannot connect to FastAPI service: {e}")
        return False

def test_metrics():
    """Test if Prometheus metrics endpoint is working"""
    try:
        print("Testing Prometheus metrics...")
        response = requests.get("http://localhost:8000/metrics", timeout=5)
        if response.status_code == 200 and "http_requests_total" in response.text:
            print("Prometheus metrics endpoint is working")
            return True
        else:
            print("Prometheus metrics endpoint not working correctly")
            return False
    except Exception as e:
        print(f"Cannot access metrics endpoint: {e}")
        return False

def test_prometheus():
    """Test if Prometheus is accessible from container"""
    try:
        print("Testing Prometheus...")
        # Use the service name from docker-compose
        response = requests.get("http://prometheus:9090", timeout=5)
        if response.status_code == 200:
            print("Prometheus is accessible")
            return True
        else:
            print(f"Prometheus returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"Cannot connect to Prometheus: {e}")
        return False

def test_jaeger():
    """Test if Jaeger is accessible from container"""
    try:
        print("Testing Jaeger...")
        # Use the service name from docker-compose
        response = requests.get("http://jaeger:16686", timeout=5)
        if response.status_code == 200:
            print("Jaeger is accessible")
            return True
        else:
            print(f"Jaeger returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"Cannot connect to Jaeger: {e}")
        return False

def generate_test_traffic():
    """Generate some test traffic"""
    print("Generating test traffic...")
    endpoints = ["/", "/health", "/api/vibe", "/api/slow"]
    
    for i in range(5):
        for endpoint in endpoints:
            try:
                response = requests.get(f"http://localhost:8000{endpoint}", timeout=10)
                print(f"  Request to {endpoint}: {response.status_code}")
                time.sleep(0.5)
            except Exception as e:
                print(f"  Error requesting {endpoint}: {e}")
    
    print("Test traffic generated")

def main():
    """Run all tests"""
    print("=" * 50)
    print("Container Vibe Monitor Setup Test")
    print("=" * 50)
    
    tests = [
        test_service,
        test_metrics,
        test_prometheus,
        test_jaeger
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()
    
    print("=" * 50)
    print(f"Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("All services are running correctly!")
        print("\nContainer URLs:")
        print("  FastAPI: http://localhost:8000")
        print("  Prometheus: http://prometheus:9090")
        print("  Jaeger: http://jaeger:16686")
        
        # Generate some test traffic
        print("\nGenerating test traffic...")
        generate_test_traffic()
        
    else:
        print("Some services are not running correctly")
        sys.exit(1)

if __name__ == "__main__":
    main()
