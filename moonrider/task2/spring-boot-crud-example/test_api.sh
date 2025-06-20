#!/bin/bash

# Test script for Product Catalog API
# Usage: ./test_api.sh [base_url]
# Default base_url: http://localhost:8080

BASE_URL=${1:-http://localhost:8080}
echo "Testing Product Catalog API at: $BASE_URL"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
    fi
}

# Test health endpoint
echo -e "\n${YELLOW}Testing Health Endpoint${NC}"
HEALTH_RESPONSE=$(curl -s -w "%{http_code}" "$BASE_URL/health" -o /tmp/health_response)
if [ $HEALTH_RESPONSE -eq 200 ]; then
    print_status 0 "Health check passed"
    cat /tmp/health_response | jq . 2>/dev/null || cat /tmp/health_response
else
    print_status 1 "Health check failed (HTTP $HEALTH_RESPONSE)"
fi

# Test adding a product
echo -e "\n${YELLOW}Testing Add Product${NC}"
ADD_RESPONSE=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/addProduct" \
    -H "Content-Type: application/json" \
    -d '{"name":"Test Product","quantity":10,"price":29.99}' \
    -o /tmp/add_response)
if [ $ADD_RESPONSE -eq 200 ]; then
    print_status 0 "Add product successful"
    PRODUCT_ID=$(cat /tmp/add_response | jq -r '.id' 2>/dev/null)
    echo "Product ID: $PRODUCT_ID"
else
    print_status 1 "Add product failed (HTTP $ADD_RESPONSE)"
    cat /tmp/add_response
fi

# Test getting all products
echo -e "\n${YELLOW}Testing Get All Products${NC}"
GET_ALL_RESPONSE=$(curl -s -w "%{http_code}" "$BASE_URL/products" -o /tmp/get_all_response)
if [ $GET_ALL_RESPONSE -eq 200 ]; then
    print_status 0 "Get all products successful"
    PRODUCT_COUNT=$(cat /tmp/get_all_response | jq '. | length' 2>/dev/null)
    echo "Number of products: $PRODUCT_COUNT"
else
    print_status 1 "Get all products failed (HTTP $GET_ALL_RESPONSE)"
fi

# Test getting product by ID
if [ ! -z "$PRODUCT_ID" ]; then
    echo -e "\n${YELLOW}Testing Get Product by ID${NC}"
    GET_BY_ID_RESPONSE=$(curl -s -w "%{http_code}" "$BASE_URL/productById/$PRODUCT_ID" -o /tmp/get_by_id_response)
    if [ $GET_BY_ID_RESPONSE -eq 200 ]; then
        print_status 0 "Get product by ID successful"
        cat /tmp/get_by_id_response | jq . 2>/dev/null || cat /tmp/get_by_id_response
    else
        print_status 1 "Get product by ID failed (HTTP $GET_BY_ID_RESPONSE)"
    fi
fi

# Test search functionality (v1.1+)
echo -e "\n${YELLOW}Testing Search Functionality${NC}"
SEARCH_RESPONSE=$(curl -s -w "%{http_code}" "$BASE_URL/products/search?keyword=Test" -o /tmp/search_response)
if [ $SEARCH_RESPONSE -eq 200 ]; then
    print_status 0 "Search functionality working"
    SEARCH_COUNT=$(cat /tmp/search_response | jq '. | length' 2>/dev/null)
    echo "Search results: $SEARCH_COUNT products found"
else
    print_status 1 "Search functionality failed (HTTP $SEARCH_RESPONSE)"
    echo "Note: Search endpoint is available in v1.1+"
fi

# Test advanced search (v2.0+)
echo -e "\n${YELLOW}Testing Advanced Search${NC}"
ADVANCED_SEARCH_RESPONSE=$(curl -s -w "%{http_code}" "$BASE_URL/products/search?keyword=Test&minPrice=20&maxPrice=50" -o /tmp/advanced_search_response)
if [ $ADVANCED_SEARCH_RESPONSE -eq 200 ]; then
    print_status 0 "Advanced search functionality working"
    ADVANCED_COUNT=$(cat /tmp/advanced_search_response | jq '. | length' 2>/dev/null)
    echo "Advanced search results: $ADVANCED_COUNT products found"
else
    print_status 1 "Advanced search functionality failed (HTTP $ADVANCED_SEARCH_RESPONSE)"
    echo "Note: Advanced search is available in v2.0+"
fi

# Test updating a product
if [ ! -z "$PRODUCT_ID" ]; then
    echo -e "\n${YELLOW}Testing Update Product${NC}"
    UPDATE_RESPONSE=$(curl -s -w "%{http_code}" -X PUT "$BASE_URL/update" \
        -H "Content-Type: application/json" \
        -d "{\"id\":$PRODUCT_ID,\"name\":\"Updated Test Product\",\"quantity\":15,\"price\":39.99}" \
        -o /tmp/update_response)
    if [ $UPDATE_RESPONSE -eq 200 ]; then
        print_status 0 "Update product successful"
        cat /tmp/update_response | jq . 2>/dev/null || cat /tmp/update_response
    else
        print_status 1 "Update product failed (HTTP $UPDATE_RESPONSE)"
    fi
fi

# Test deleting a product
if [ ! -z "$PRODUCT_ID" ]; then
    echo -e "\n${YELLOW}Testing Delete Product${NC}"
    DELETE_RESPONSE=$(curl -s -w "%{http_code}" -X DELETE "$BASE_URL/delete/$PRODUCT_ID" -o /tmp/delete_response)
    if [ $DELETE_RESPONSE -eq 200 ]; then
        print_status 0 "Delete product successful"
        cat /tmp/delete_response | jq . 2>/dev/null || cat /tmp/delete_response
    else
        print_status 1 "Delete product failed (HTTP $DELETE_RESPONSE)"
    fi
fi

# Test error handling
echo -e "\n${YELLOW}Testing Error Handling${NC}"

# Test invalid product creation
echo "Testing invalid product creation..."
INVALID_ADD_RESPONSE=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/addProduct" \
    -H "Content-Type: application/json" \
    -d '{"name":"","quantity":-1,"price":-10}' \
    -o /tmp/invalid_add_response)
if [ $INVALID_ADD_RESPONSE -eq 400 ]; then
    print_status 0 "Error handling for invalid input working"
else
    print_status 1 "Error handling for invalid input failed (HTTP $INVALID_ADD_RESPONSE)"
fi

# Test non-existent product
echo "Testing non-existent product retrieval..."
NOT_FOUND_RESPONSE=$(curl -s -w "%{http_code}" "$BASE_URL/productById/99999" -o /tmp/not_found_response)
if [ $NOT_FOUND_RESPONSE -eq 404 ]; then
    print_status 0 "Error handling for non-existent product working"
else
    print_status 1 "Error handling for non-existent product failed (HTTP $NOT_FOUND_RESPONSE)"
fi

# Cleanup
rm -f /tmp/*_response

echo -e "\n${YELLOW}API Testing Complete${NC}" 