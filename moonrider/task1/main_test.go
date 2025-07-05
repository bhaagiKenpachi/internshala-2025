package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

// TestHealthHandler tests the health check endpoint
func TestHealthHandler(t *testing.T) {
	req, err := http.NewRequest("GET", "/health", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(healthHandler)

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	expected := `{"status":"healthy"}`
	if rr.Body.String() != expected {
		t.Errorf("handler returned unexpected body: got %v want %v", rr.Body.String(), expected)
	}
}

// TestIdentifyHandler tests the identify endpoint with valid request
func TestIdentifyHandler(t *testing.T) {
	// Skip if database is not available
	if db == nil {
		t.Skip("Database not available for testing")
	}

	requestBody := IdentifyRequest{
		Email:       "test@example.com",
		PhoneNumber: "1234567890",
	}

	jsonBody, _ := json.Marshal(requestBody)
	req, err := http.NewRequest("POST", "/identify", bytes.NewBuffer(jsonBody))
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(identifyHandler)

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	// Check if response is valid JSON
	var response IdentifyResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &response); err != nil {
		t.Errorf("handler returned invalid JSON: %v", err)
	}
}

// TestIdentifyHandlerInvalidRequest tests the identify endpoint with invalid request
func TestIdentifyHandlerInvalidRequest(t *testing.T) {
	req, err := http.NewRequest("POST", "/identify", bytes.NewBuffer([]byte("invalid json")))
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(identifyHandler)

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusBadRequest {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusBadRequest)
	}
}

// TestIdentifyHandlerEmptyRequest tests the identify endpoint with empty request
func TestIdentifyHandlerEmptyRequest(t *testing.T) {
	requestBody := IdentifyRequest{
		Email:       "",
		PhoneNumber: "",
	}

	jsonBody, _ := json.Marshal(requestBody)
	req, err := http.NewRequest("POST", "/identify", bytes.NewBuffer(jsonBody))
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(identifyHandler)

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusBadRequest {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusBadRequest)
	}
}

// TestBuildResponse tests the buildResponse function
func TestBuildResponse(t *testing.T) {
	// Create test data
	primaryContact := &Contact{
		ID:             1,
		Email:          stringPtr("primary@example.com"),
		PhoneNumber:    stringPtr("1234567890"),
		LinkPrecedence: "primary",
	}

	secondaryContact := &Contact{
		ID:             2,
		Email:          stringPtr("secondary@example.com"),
		PhoneNumber:    stringPtr("0987654321"),
		LinkedID:       intPtr(1),
		LinkPrecedence: "secondary",
	}

	secondaryContacts := []*Contact{secondaryContact}

	// Test buildResponse
	response, err := buildResponse(primaryContact, secondaryContacts)
	if err != nil {
		t.Fatalf("buildResponse failed: %v", err)
	}

	// Verify response structure
	if response.Contact.PrimaryContactID != 1 {
		t.Errorf("expected primary contact ID 1, got %d", response.Contact.PrimaryContactID)
	}

	if len(response.Contact.Emails) != 2 {
		t.Errorf("expected 2 emails, got %d", len(response.Contact.Emails))
	}

	if len(response.Contact.PhoneNumbers) != 2 {
		t.Errorf("expected 2 phone numbers, got %d", len(response.Contact.PhoneNumbers))
	}

	if len(response.Contact.SecondaryContactIDs) != 1 {
		t.Errorf("expected 1 secondary contact ID, got %d", len(response.Contact.SecondaryContactIDs))
	}
}

// Helper functions for testing
func stringPtr(s string) *string {
	return &s
}

func intPtr(i int) *int {
	return &i
}
