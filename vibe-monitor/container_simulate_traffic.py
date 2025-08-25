#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import requests
import time
import random
import threading
from concurrent.futures import ThreadPoolExecutor
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_URL = "http://localhost:8000"  # Use localhost since we're in the container
ENDPOINTS = [
    "/",
    "/health",
    "/api/vibe",
    "/api/slow"
]

def make_request(endpoint):
    """Make a single request to the specified endpoint"""
    try:
        start_time = time.time()
        response = requests.get(f"{BASE_URL}{endpoint}", timeout=10)
        latency = time.time() - start_time
        
        logger.info(f"Request to {endpoint} - Status: {response.status_code} - Latency: {latency:.3f}s")
        
        if response.status_code == 200:
            logger.info(f"Response: {response.json()}")
        
        return response.status_code, latency
    except Exception as e:
        logger.error(f"Error making request to {endpoint}: {e}")
        return None, None

def continuous_traffic(duration=300):  # 5 minutes default
    """Generate continuous traffic for the specified duration"""
    logger.info(f"Starting traffic simulation for {duration} seconds...")
    
    start_time = time.time()
    request_count = 0
    
    while time.time() - start_time < duration:
        # Randomly select an endpoint
        endpoint = random.choice(ENDPOINTS)
        
        # Make the request
        status, latency = make_request(endpoint)
        request_count += 1
        
        # Random delay between requests (0.1 to 2 seconds)
        delay = random.uniform(0.1, 2.0)
        time.sleep(delay)
        
        # Log progress every 10 requests
        if request_count % 10 == 0:
            elapsed = time.time() - start_time
            logger.info(f"Progress: {request_count} requests in {elapsed:.1f}s")
    
    logger.info(f"Traffic simulation completed. Total requests: {request_count}")

def burst_traffic():
    """Generate burst traffic using multiple threads"""
    logger.info("Starting burst traffic simulation...")
    
    with ThreadPoolExecutor(max_workers=10) as executor:
        # Submit multiple requests simultaneously
        futures = []
        for _ in range(20):
            endpoint = random.choice(ENDPOINTS)
            futures.append(executor.submit(make_request, endpoint))
        
        # Wait for all requests to complete
        for future in futures:
            future.result()
    
    logger.info("Burst traffic simulation completed")

def main():
    """Main function to run different traffic patterns"""
    logger.info("Starting Container Vibe Monitor Traffic Simulation")
    logger.info(f"Target URL: {BASE_URL}")
    logger.info("Available endpoints: " + ", ".join(ENDPOINTS))
    
    try:
        # Test if the service is running
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            logger.info("Service is running and healthy!")
        else:
            logger.error("Service is not responding correctly")
            return
    except Exception as e:
        logger.error(f"Cannot connect to service: {e}")
        logger.info("Make sure the service is running")
        return
    
    # Run different traffic patterns
    while True:
        print("\n" + "="*50)
        print("Traffic Simulation Menu:")
        print("1. Continuous traffic (5 minutes)")
        print("2. Burst traffic")
        print("3. Custom duration continuous traffic")
        print("4. Exit")
        print("="*50)
        
        try:
            choice = input("Select an option (1-4): ").strip()
        except (EOFError, KeyboardInterrupt):
            logger.info("Exiting traffic simulation")
            break
        
        if choice == "1":
            continuous_traffic(300)  # 5 minutes
        elif choice == "2":
            burst_traffic()
        elif choice == "3":
            try:
                duration = int(input("Enter duration in seconds: "))
                continuous_traffic(duration)
            except ValueError:
                logger.error("Invalid duration. Please enter a number.")
        elif choice == "4":
            logger.info("Exiting traffic simulation")
            break
        else:
            logger.error("Invalid choice. Please select 1-4.")

if __name__ == "__main__":
    main()
