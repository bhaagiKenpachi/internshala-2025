package com.moonrider.identityreconciliation.service;

import com.moonrider.identityreconciliation.dto.IdentifyRequest;
import com.moonrider.identityreconciliation.dto.IdentifyResponse;
import com.moonrider.identityreconciliation.entity.Contact;
import com.moonrider.identityreconciliation.repository.ContactRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class IdentityReconciliationService {

    private static final Logger log = LoggerFactory.getLogger(IdentityReconciliationService.class);
    private final ContactRepository contactRepository;

    public IdentityReconciliationService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Transactional
    public IdentifyResponse processIdentification(IdentifyRequest request) {
        log.info("Processing identification request for email: {} and phone: {}",
                request.getEmail(), request.getPhoneNumber());

        // Find existing contacts that match the request
        List<Contact> existingContacts = contactRepository.findByEmailOrPhoneNumber(
                request.getEmail(), request.getPhoneNumber());

        Contact primaryContact;
        List<Contact> secondaryContacts = new ArrayList<>();

        if (existingContacts.isEmpty()) {
            // No matches found - create new primary contact
            log.info("No existing contacts found, creating new primary contact");
            primaryContact = createPrimaryContact(request);
        } else {
            // Matches found - handle linking logic
            log.info("Found {} existing contacts, processing linking logic", existingContacts.size());
            var result = handleExistingContacts(request, existingContacts);
            primaryContact = result.getKey();
            secondaryContacts = result.getValue();
        }

        // Build and return response
        return buildResponse(primaryContact, secondaryContacts);
    }

    private Contact createPrimaryContact(IdentifyRequest request) {
        Contact primaryContact = new Contact(
                request.getEmail(),
                request.getPhoneNumber(),
                Contact.LinkPrecedence.PRIMARY);
        return contactRepository.save(primaryContact);
    }

    private Map.Entry<Contact, List<Contact>> handleExistingContacts(
            IdentifyRequest request, List<Contact> existingContacts) {

        // Find the primary contact among existing contacts
        Contact primaryContact = findPrimaryContact(existingContacts);
        List<Contact> secondaryContacts = new ArrayList<>();

        // Check if we need to create a new secondary contact
        boolean needNewSecondary = shouldCreateSecondaryContact(request, existingContacts);

        if (needNewSecondary) {
            Contact newSecondary = new Contact(
                    request.getEmail(),
                    request.getPhoneNumber(),
                    primaryContact);
            Contact savedSecondary = contactRepository.save(newSecondary);
            secondaryContacts.add(savedSecondary);
        }

        // Get all existing secondary contacts for this primary
        List<Contact> existingSecondary = contactRepository.findSecondaryContactsByPrimaryId(primaryContact.getId());
        secondaryContacts.addAll(existingSecondary);

        return new AbstractMap.SimpleEntry<>(primaryContact, secondaryContacts);
    }

    private Contact findPrimaryContact(List<Contact> contacts) {
        // Find the primary contact among the given contacts
        Optional<Contact> primary = contacts.stream()
                .filter(c -> c.getLinkPrecedence() == Contact.LinkPrecedence.PRIMARY)
                .findFirst();

        if (primary.isPresent()) {
            return primary.get();
        }

        // If no primary found, the first contact should be primary
        // This handles the case where we have secondary contacts but need to find their
        // primary
        Contact firstContact = contacts.get(0);
        if (firstContact.getLinkedContact() != null) {
            return firstContact.getLinkedContact();
        }

        // If still no primary, make the first contact primary
        firstContact.setLinkPrecedence(Contact.LinkPrecedence.PRIMARY);
        firstContact.setLinkedContact(null);
        return contactRepository.save(firstContact);
    }

    private boolean shouldCreateSecondaryContact(IdentifyRequest request, List<Contact> existingContacts) {
        // Check if the exact email and phone combination already exists
        return existingContacts.stream()
                .noneMatch(c -> Objects.equals(c.getEmail(), request.getEmail()) &&
                        Objects.equals(c.getPhoneNumber(), request.getPhoneNumber()));
    }

    private IdentifyResponse buildResponse(Contact primaryContact, List<Contact> secondaryContacts) {
        // Collect all emails (primary + secondary)
        Set<String> emails = new HashSet<>();
        if (primaryContact.getEmail() != null) {
            emails.add(primaryContact.getEmail());
        }
        secondaryContacts.stream()
                .map(Contact::getEmail)
                .filter(Objects::nonNull)
                .forEach(emails::add);

        // Collect all phone numbers (primary + secondary)
        Set<String> phoneNumbers = new HashSet<>();
        if (primaryContact.getPhoneNumber() != null) {
            phoneNumbers.add(primaryContact.getPhoneNumber());
        }
        secondaryContacts.stream()
                .map(Contact::getPhoneNumber)
                .filter(Objects::nonNull)
                .forEach(phoneNumbers::add);

        // Collect secondary contact IDs
        List<Long> secondaryIds = secondaryContacts.stream()
                .map(Contact::getId)
                .collect(Collectors.toList());

        IdentifyResponse.ContactInfo contactInfo = new IdentifyResponse.ContactInfo(
                primaryContact.getId(),
                new ArrayList<>(emails),
                new ArrayList<>(phoneNumbers),
                secondaryIds);

        return new IdentifyResponse(contactInfo);
    }
}