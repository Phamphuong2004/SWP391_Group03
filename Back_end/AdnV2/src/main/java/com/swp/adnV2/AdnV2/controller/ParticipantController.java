package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.ParticipantRequest;
import com.swp.adnV2.AdnV2.service.ParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/participant")
public class ParticipantController {
    @Autowired
    private ParticipantService _service;

    @GetMapping("/get/{participantId}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> participantId(@PathVariable String participantId) {
        return _service.getParticipantById(Long.parseLong(participantId));
    }

    @GetMapping("/get/phone/{phone}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> participantPhone(@PathVariable String phone) {
        return _service.getParticipantByPhone(phone);
    }

    @GetMapping("/get/email/{email}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> participantEmail(@PathVariable String email) {
        return _service.getParticipantByEmail(email);
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> addParticipant(@RequestBody ParticipantRequest request) {
        return _service.addParticipant(request);
    }

    @PutMapping("/update/{participantId}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> updateParticipant(@PathVariable Long participantId, @RequestBody ParticipantRequest request) {
        return _service.updateParticipant(participantId, request);
    }

    @DeleteMapping("/delete/{participantId}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> deleteParticipant(@PathVariable Long participantId) {
        return _service.deleteParticipant(participantId);
    }
}
