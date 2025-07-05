package com.moonrider.identityreconciliation.dto;

import jakarta.validation.constraints.NotBlank;

public class IdentifyRequest {

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    // Default constructor
    public IdentifyRequest() {
    }

    // Constructor with parameters
    public IdentifyRequest(String email, String phoneNumber) {
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

    // Getter and setter methods
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}