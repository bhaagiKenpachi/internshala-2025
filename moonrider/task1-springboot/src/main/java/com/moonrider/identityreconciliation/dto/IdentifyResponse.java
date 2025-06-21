package com.moonrider.identityreconciliation.dto;

import java.util.List;

public class IdentifyResponse {

    private ContactInfo contact;

    // Default constructor
    public IdentifyResponse() {
    }

    // Constructor with contact info
    public IdentifyResponse(ContactInfo contact) {
        this.contact = contact;
    }

    // Getter and setter methods
    public ContactInfo getContact() {
        return contact;
    }

    public void setContact(ContactInfo contact) {
        this.contact = contact;
    }

    public static class ContactInfo {
        private Long primaryContactId;
        private List<String> emails;
        private List<String> phoneNumbers;
        private List<Long> secondaryContactIds;

        // Default constructor
        public ContactInfo() {
        }

        // Constructor with all parameters
        public ContactInfo(Long primaryContactId, List<String> emails, List<String> phoneNumbers,
                List<Long> secondaryContactIds) {
            this.primaryContactId = primaryContactId;
            this.emails = emails;
            this.phoneNumbers = phoneNumbers;
            this.secondaryContactIds = secondaryContactIds;
        }

        // Getter and setter methods
        public Long getPrimaryContactId() {
            return primaryContactId;
        }

        public void setPrimaryContactId(Long primaryContactId) {
            this.primaryContactId = primaryContactId;
        }

        public List<String> getEmails() {
            return emails;
        }

        public void setEmails(List<String> emails) {
            this.emails = emails;
        }

        public List<String> getPhoneNumbers() {
            return phoneNumbers;
        }

        public void setPhoneNumbers(List<String> phoneNumbers) {
            this.phoneNumbers = phoneNumbers;
        }

        public List<Long> getSecondaryContactIds() {
            return secondaryContactIds;
        }

        public void setSecondaryContactIds(List<Long> secondaryContactIds) {
            this.secondaryContactIds = secondaryContactIds;
        }
    }
}