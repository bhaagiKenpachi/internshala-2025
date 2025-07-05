package com.moonrider.identityreconciliation.controller;

import com.moonrider.identityreconciliation.dto.IdentifyRequest;
import com.moonrider.identityreconciliation.dto.IdentifyResponse;
import com.moonrider.identityreconciliation.service.IdentityReconciliationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class IdentityController {

    private static final Logger log = LoggerFactory.getLogger(IdentityController.class);
    private final IdentityReconciliationService identityService;

    public IdentityController(IdentityReconciliationService identityService) {
        this.identityService = identityService;
    }

    @PostMapping("/identify")
    public ResponseEntity<IdentifyResponse> identify(@Valid @RequestBody IdentifyRequest request) {
        log.info("Received identify request for email: {} and phone: {}",
                request.getEmail(), request.getPhoneNumber());

        IdentifyResponse response = identityService.processIdentification(request);

        log.info("Processed identification request successfully. Primary contact ID: {}",
                response.getContact().getPrimaryContactId());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "healthy", "service", "Identity Reconciliation Service"));
    }
}