#!/bin/bash

# Script to run commands inside the vibe-monitor app container

CONTAINER_NAME="vibe-monitor-app-1"

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  test        - Run the container test script"
    echo "  traffic     - Run the traffic simulation script"
    echo "  shell       - Open a shell in the container"
    echo "  logs        - Show container logs"
    echo "  restart     - Restart the app container"
    echo "  rebuild     - Rebuild and restart the app container"
    echo ""
    echo "Examples:"
    echo "  $0 test"
    echo "  $0 traffic"
    echo "  $0 shell"
}

# Check if container is running
check_container() {
    if ! docker ps --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
        echo "Error: Container ${CONTAINER_NAME} is not running."
        echo "Start the services with: docker compose up -d"
        exit 1
    fi
}

# Main script logic
case "$1" in
    "test")
        check_container
        echo "Running container test script..."
        docker exec -it ${CONTAINER_NAME} python container_test.py
        ;;
    "traffic")
        check_container
        echo "Running traffic simulation in container..."
        docker exec -it ${CONTAINER_NAME} python container_simulate_traffic.py
        ;;
    "shell")
        check_container
        echo "Opening shell in container..."
        docker exec -it ${CONTAINER_NAME} /bin/bash
        ;;
    "logs")
        echo "Showing container logs..."
        docker logs -f ${CONTAINER_NAME}
        ;;
    "restart")
        echo "Restarting app container..."
        docker compose restart app
        ;;
    "rebuild")
        echo "Rebuilding and restarting app container..."
        docker compose build app
        docker compose up -d app
        ;;
    *)
        show_usage
        exit 1
        ;;
esac
