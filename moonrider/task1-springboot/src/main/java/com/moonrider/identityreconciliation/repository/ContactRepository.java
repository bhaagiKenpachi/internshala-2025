package com.moonrider.identityreconciliation.repository;

import com.moonrider.identityreconciliation.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    
    // Find contacts by email or phone number
    @Query("SELECT c FROM Contact c WHERE c.deletedAt IS NULL AND (c.email = :email OR c.phoneNumber = :phoneNumber)")
    List<Contact> findByEmailOrPhoneNumber(@Param("email") String email, @Param("phoneNumber") String phoneNumber);
    
    // Find primary contacts by email or phone number
    @Query("SELECT c FROM Contact c WHERE c.deletedAt IS NULL AND c.linkPrecedence = 'PRIMARY' AND (c.email = :email OR c.phoneNumber = :phoneNumber)")
    List<Contact> findPrimaryContactsByEmailOrPhoneNumber(@Param("email") String email, @Param("phoneNumber") String phoneNumber);
    
    // Find all secondary contacts linked to a primary contact
    @Query("SELECT c FROM Contact c WHERE c.deletedAt IS NULL AND c.linkPrecedence = 'SECONDARY' AND c.linkedContact.id = :primaryContactId")
    List<Contact> findSecondaryContactsByPrimaryId(@Param("primaryContactId") Long primaryContactId);
    
    // Find all contacts (primary and secondary) linked to a primary contact
    @Query("SELECT c FROM Contact c WHERE c.deletedAt IS NULL AND (c.id = :primaryContactId OR c.linkedContact.id = :primaryContactId)")
    List<Contact> findAllContactsByPrimaryId(@Param("primaryContactId") Long primaryContactId);
    
    // Check if email exists
    Optional<Contact> findByEmailAndDeletedAtIsNull(String email);
    
    // Check if phone number exists
    Optional<Contact> findByPhoneNumberAndDeletedAtIsNull(String phoneNumber);
} 