package com.moonrider.identityreconciliation.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "contacts")
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "email", length = 255)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "linked_id")
    private Contact linkedContact;

    @Enumerated(EnumType.STRING)
    @Column(name = "link_precedence", length = 10)
    private LinkPrecedence linkPrecedence;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public enum LinkPrecedence {
        PRIMARY, SECONDARY
    }

    // Default constructor
    public Contact() {
    }

    // Constructor for creating new contacts
    public Contact(String email, String phoneNumber, LinkPrecedence linkPrecedence) {
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.linkPrecedence = linkPrecedence;
    }

    // Constructor for creating secondary contacts
    public Contact(String email, String phoneNumber, Contact linkedContact) {
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.linkedContact = linkedContact;
        this.linkPrecedence = LinkPrecedence.SECONDARY;
    }

    // Getter and setter methods
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Contact getLinkedContact() {
        return linkedContact;
    }

    public void setLinkedContact(Contact linkedContact) {
        this.linkedContact = linkedContact;
    }

    public LinkPrecedence getLinkPrecedence() {
        return linkPrecedence;
    }

    public void setLinkPrecedence(LinkPrecedence linkPrecedence) {
        this.linkPrecedence = linkPrecedence;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }
}