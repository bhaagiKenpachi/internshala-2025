package com.moonrider.identityreconciliation.service;

import com.moonrider.identityreconciliation.dto.IdentifyRequest;
import com.moonrider.identityreconciliation.dto.IdentifyResponse;
import com.moonrider.identityreconciliation.entity.Contact;
import com.moonrider.identityreconciliation.repository.ContactRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IdentityReconciliationServiceTest {

    @Mock
    private ContactRepository contactRepository;

    @InjectMocks
    private IdentityReconciliationService service;

    private IdentifyRequest request;

    @BeforeEach
    void setUp() {
        request = new IdentifyRequest();
        request.setEmail("test@example.com");
        request.setPhoneNumber("1234567890");
    }

    @Test
    void testProcessIdentification_NewCustomer() {
        // Given
        when(contactRepository.findByEmailOrPhoneNumber(anyString(), anyString()))
                .thenReturn(Collections.emptyList());
        
        Contact savedContact = new Contact("test@example.com", "1234567890", Contact.LinkPrecedence.PRIMARY);
        savedContact.setId(1L);
        when(contactRepository.save(any(Contact.class))).thenReturn(savedContact);

        // When
        IdentifyResponse response = service.processIdentification(request);

        // Then
        assertNotNull(response);
        assertNotNull(response.getContact());
        assertEquals(1L, response.getContact().getPrimaryContactId());
        assertTrue(response.getContact().getEmails().contains("test@example.com"));
        assertTrue(response.getContact().getPhoneNumbers().contains("1234567890"));
        assertTrue(response.getContact().getSecondaryContactIds().isEmpty());

        verify(contactRepository).findByEmailOrPhoneNumber("test@example.com", "1234567890");
        verify(contactRepository).save(any(Contact.class));
    }

    @Test
    void testProcessIdentification_ExistingCustomer_NewPhone() {
        // Given
        Contact existingContact = new Contact("test@example.com", "1234567890", Contact.LinkPrecedence.PRIMARY);
        existingContact.setId(1L);
        
        when(contactRepository.findByEmailOrPhoneNumber("test@example.com", "0987654321"))
                .thenReturn(Arrays.asList(existingContact));
        
        when(contactRepository.findSecondaryContactsByPrimaryId(1L))
                .thenReturn(Collections.emptyList());

        Contact newSecondary = new Contact("test@example.com", "0987654321", existingContact);
        newSecondary.setId(2L);
        when(contactRepository.save(any(Contact.class))).thenReturn(newSecondary);

        // When
        request.setPhoneNumber("0987654321");
        IdentifyResponse response = service.processIdentification(request);

        // Then
        assertNotNull(response);
        assertEquals(1L, response.getContact().getPrimaryContactId());
        assertTrue(response.getContact().getEmails().contains("test@example.com"));
        assertTrue(response.getContact().getPhoneNumbers().contains("1234567890"));
        assertTrue(response.getContact().getPhoneNumbers().contains("0987654321"));
        assertEquals(1, response.getContact().getSecondaryContactIds().size());
        assertTrue(response.getContact().getSecondaryContactIds().contains(2L));
    }

    @Test
    void testProcessIdentification_ExistingCustomer_SameContact() {
        // Given
        Contact existingContact = new Contact("test@example.com", "1234567890", Contact.LinkPrecedence.PRIMARY);
        existingContact.setId(1L);
        
        when(contactRepository.findByEmailOrPhoneNumber("test@example.com", "1234567890"))
                .thenReturn(Arrays.asList(existingContact));
        
        when(contactRepository.findSecondaryContactsByPrimaryId(1L))
                .thenReturn(Collections.emptyList());

        // When
        IdentifyResponse response = service.processIdentification(request);

        // Then
        assertNotNull(response);
        assertEquals(1L, response.getContact().getPrimaryContactId());
        assertTrue(response.getContact().getEmails().contains("test@example.com"));
        assertTrue(response.getContact().getPhoneNumbers().contains("1234567890"));
        assertTrue(response.getContact().getSecondaryContactIds().isEmpty());

        verify(contactRepository, never()).save(any(Contact.class));
    }

    @Test
    void testProcessIdentification_MultipleSecondaryContacts() {
        // Given
        Contact primaryContact = new Contact("test@example.com", "1234567890", Contact.LinkPrecedence.PRIMARY);
        primaryContact.setId(1L);
        
        Contact secondary1 = new Contact("test2@example.com", "1234567890", primaryContact);
        secondary1.setId(2L);
        Contact secondary2 = new Contact("test@example.com", "0987654321", primaryContact);
        secondary2.setId(3L);
        
        when(contactRepository.findByEmailOrPhoneNumber("test3@example.com", "5555555555"))
                .thenReturn(Arrays.asList(primaryContact, secondary1, secondary2));
        
        when(contactRepository.findSecondaryContactsByPrimaryId(1L))
                .thenReturn(Arrays.asList(secondary1, secondary2));

        Contact newSecondary = new Contact("test3@example.com", "5555555555", primaryContact);
        newSecondary.setId(4L);
        when(contactRepository.save(any(Contact.class))).thenReturn(newSecondary);

        // When
        request.setEmail("test3@example.com");
        request.setPhoneNumber("5555555555");
        IdentifyResponse response = service.processIdentification(request);

        // Then
        assertNotNull(response);
        assertEquals(1L, response.getContact().getPrimaryContactId());
        assertTrue(response.getContact().getEmails().contains("test@example.com"));
        assertTrue(response.getContact().getEmails().contains("test2@example.com"));
        assertTrue(response.getContact().getEmails().contains("test3@example.com"));
        assertTrue(response.getContact().getPhoneNumbers().contains("1234567890"));
        assertTrue(response.getContact().getPhoneNumbers().contains("0987654321"));
        assertTrue(response.getContact().getPhoneNumbers().contains("5555555555"));
        assertEquals(3, response.getContact().getSecondaryContactIds().size());
    }
} 