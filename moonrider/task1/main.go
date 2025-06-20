package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

// Contact represents a contact entity in the database
type Contact struct {
	ID             int        `json:"id"`
	PhoneNumber    *string    `json:"phoneNumber"`
	Email          *string    `json:"email"`
	LinkedID       *int       `json:"linkedId"`
	LinkPrecedence string     `json:"linkPrecedence"`
	CreatedAt      time.Time  `json:"createdAt"`
	UpdatedAt      time.Time  `json:"updatedAt"`
	DeletedAt      *time.Time `json:"deletedAt"`
}

// IdentifyRequest represents the incoming request payload
type IdentifyRequest struct {
	Email       string `json:"email"`
	PhoneNumber string `json:"phoneNumber"`
}

// IdentifyResponse represents the response payload
type IdentifyResponse struct {
	Contact struct {
		PrimaryContactID    int      `json:"primaryContactId"`
		Emails              []string `json:"emails"`
		PhoneNumbers        []string `json:"phoneNumbers"`
		SecondaryContactIDs []int    `json:"secondaryContactIds"`
	} `json:"contact"`
}

// Database connection
var db *sql.DB

func main() {
	// Initialize database connection
	initDB()
	defer db.Close()

	// Create router
	r := mux.NewRouter()

	// Define routes
	r.HandleFunc("/identify", identifyHandler).Methods("POST")
	r.HandleFunc("/health", healthHandler).Methods("GET")

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}

// initDB initializes the database connection and creates tables
func initDB() {
	// Database connection string
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		connStr = "postgres://postgres:password@localhost/identity_db?sslmode=disable"
	}

	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Error opening database:", err)
	}

	// Test connection
	err = db.Ping()
	if err != nil {
		log.Fatal("Error connecting to database:", err)
	}

	// Create tables
	createTables()
	log.Println("Database initialized successfully")
}

// createTables creates the necessary database tables
func createTables() {
	query := `
	CREATE TABLE IF NOT EXISTS contacts (
		id SERIAL PRIMARY KEY,
		phone_number VARCHAR(20),
		email VARCHAR(255),
		linked_id INTEGER REFERENCES contacts(id),
		link_precedence VARCHAR(10) CHECK (link_precedence IN ('primary', 'secondary')),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		deleted_at TIMESTAMP
	);
	
	CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email) WHERE email IS NOT NULL;
	CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone_number) WHERE phone_number IS NOT NULL;
	CREATE INDEX IF NOT EXISTS idx_contacts_linked_id ON contacts(linked_id) WHERE linked_id IS NOT NULL;
	`

	_, err := db.Exec(query)
	if err != nil {
		log.Fatal("Error creating tables:", err)
	}
}

// healthHandler provides a simple health check endpoint
func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "healthy"})
}

// identifyHandler processes the identity reconciliation request
func identifyHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Parse request
	var req IdentifyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request format", http.StatusBadRequest)
		return
	}

	// Validate request
	if req.Email == "" && req.PhoneNumber == "" {
		http.Error(w, "At least one of email or phone number is required", http.StatusBadRequest)
		return
	}

	// Process the identification
	response, err := processIdentification(req)
	if err != nil {
		log.Printf("Error processing identification: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Return response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// processIdentification handles the core logic of identity reconciliation
func processIdentification(req IdentifyRequest) (*IdentifyResponse, error) {
	// Find existing contacts that match the request
	existingContacts, err := findMatchingContacts(req)
	if err != nil {
		return nil, err
	}

	var primaryContact *Contact
	var secondaryContacts []*Contact

	if len(existingContacts) == 0 {
		// No matches found - create new primary contact
		primaryContact, err = createPrimaryContact(req)
		if err != nil {
			return nil, err
		}
	} else {
		// Matches found - handle linking logic
		primaryContact, secondaryContacts, err = handleExistingContacts(req, existingContacts)
		if err != nil {
			return nil, err
		}
	}

	// Build response
	return buildResponse(primaryContact, secondaryContacts)
}

// findMatchingContacts finds contacts that match the email or phone number
func findMatchingContacts(req IdentifyRequest) ([]*Contact, error) {
	query := `
		SELECT id, phone_number, email, linked_id, link_precedence, created_at, updated_at, deleted_at
		FROM contacts 
		WHERE deleted_at IS NULL 
		AND (
			(email = $1 AND $1 != '') 
			OR (phone_number = $2 AND $2 != '')
		)
	`

	rows, err := db.Query(query, req.Email, req.PhoneNumber)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var contacts []*Contact
	for rows.Next() {
		contact := &Contact{}
		err := rows.Scan(
			&contact.ID,
			&contact.PhoneNumber,
			&contact.Email,
			&contact.LinkedID,
			&contact.LinkPrecedence,
			&contact.CreatedAt,
			&contact.UpdatedAt,
			&contact.DeletedAt,
		)
		if err != nil {
			return nil, err
		}
		contacts = append(contacts, contact)
	}

	return contacts, nil
}

// createPrimaryContact creates a new primary contact
func createPrimaryContact(req IdentifyRequest) (*Contact, error) {
	query := `
		INSERT INTO contacts (phone_number, email, link_precedence, created_at, updated_at)
		VALUES ($1, $2, 'primary', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
		RETURNING id, phone_number, email, linked_id, link_precedence, created_at, updated_at, deleted_at
	`

	contact := &Contact{}
	err := db.QueryRow(query, req.PhoneNumber, req.Email).Scan(
		&contact.ID,
		&contact.PhoneNumber,
		&contact.Email,
		&contact.LinkedID,
		&contact.LinkPrecedence,
		&contact.CreatedAt,
		&contact.UpdatedAt,
		&contact.DeletedAt,
	)

	return contact, err
}

// handleExistingContacts processes the case where matching contacts are found
func handleExistingContacts(req IdentifyRequest, existingContacts []*Contact) (*Contact, []*Contact, error) {
	// Find the primary contact
	var primaryContact *Contact
	var secondaryContacts []*Contact

	for _, contact := range existingContacts {
		if contact.LinkPrecedence == "primary" {
			primaryContact = contact
		} else {
			secondaryContacts = append(secondaryContacts, contact)
		}
	}

	// If no primary contact found, make the first one primary
	if primaryContact == nil && len(existingContacts) > 0 {
		primaryContact = existingContacts[0]
		// Update to primary
		_, err := db.Exec("UPDATE contacts SET link_precedence = 'primary' WHERE id = $1", primaryContact.ID)
		if err != nil {
			return nil, nil, err
		}
		primaryContact.LinkPrecedence = "primary"
	}

	// Check if we need to create a new secondary contact
	needNewSecondary := false

	// Check if the new email is not already in any existing contact
	if req.Email != "" {
		emailExists := false
		for _, contact := range existingContacts {
			if contact.Email != nil && *contact.Email == req.Email {
				emailExists = true
				break
			}
		}
		if !emailExists {
			needNewSecondary = true
		}
	}

	// Check if the new phone number is not already in any existing contact
	if req.PhoneNumber != "" {
		phoneExists := false
		for _, contact := range existingContacts {
			if contact.PhoneNumber != nil && *contact.PhoneNumber == req.PhoneNumber {
				phoneExists = true
				break
			}
		}
		if !phoneExists {
			needNewSecondary = true
		}
	}

	// Create new secondary contact if needed
	if needNewSecondary {
		newSecondary, err := createSecondaryContact(req, primaryContact.ID)
		if err != nil {
			return nil, nil, err
		}
		secondaryContacts = append(secondaryContacts, newSecondary)
	}

	return primaryContact, secondaryContacts, nil
}

// createSecondaryContact creates a new secondary contact linked to a primary contact
func createSecondaryContact(req IdentifyRequest, primaryID int) (*Contact, error) {
	query := `
		INSERT INTO contacts (phone_number, email, linked_id, link_precedence, created_at, updated_at)
		VALUES ($1, $2, $3, 'secondary', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
		RETURNING id, phone_number, email, linked_id, link_precedence, created_at, updated_at, deleted_at
	`

	contact := &Contact{}
	err := db.QueryRow(query, req.PhoneNumber, req.Email, primaryID).Scan(
		&contact.ID,
		&contact.PhoneNumber,
		&contact.Email,
		&contact.LinkedID,
		&contact.LinkPrecedence,
		&contact.CreatedAt,
		&contact.UpdatedAt,
		&contact.DeletedAt,
	)

	return contact, err
}

// buildResponse constructs the final response payload
func buildResponse(primaryContact *Contact, secondaryContacts []*Contact) (*IdentifyResponse, error) {
	response := &IdentifyResponse{}
	response.Contact.PrimaryContactID = primaryContact.ID

	// Collect all emails
	emails := make(map[string]bool)
	if primaryContact.Email != nil {
		emails[*primaryContact.Email] = true
	}
	for _, contact := range secondaryContacts {
		if contact.Email != nil {
			emails[*contact.Email] = true
		}
	}
	for email := range emails {
		response.Contact.Emails = append(response.Contact.Emails, email)
	}

	// Collect all phone numbers
	phoneNumbers := make(map[string]bool)
	if primaryContact.PhoneNumber != nil {
		phoneNumbers[*primaryContact.PhoneNumber] = true
	}
	for _, contact := range secondaryContacts {
		if contact.PhoneNumber != nil {
			phoneNumbers[*contact.PhoneNumber] = true
		}
	}
	for phone := range phoneNumbers {
		response.Contact.PhoneNumbers = append(response.Contact.PhoneNumbers, phone)
	}

	// Collect secondary contact IDs
	for _, contact := range secondaryContacts {
		response.Contact.SecondaryContactIDs = append(response.Contact.SecondaryContactIDs, contact.ID)
	}

	return response, nil
}
