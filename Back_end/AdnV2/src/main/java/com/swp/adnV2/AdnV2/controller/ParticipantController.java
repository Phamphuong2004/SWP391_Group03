package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.ParticipantRequest;
import com.swp.adnV2.AdnV2.service.ParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/participant")
public class ParticipantController {
    @Autowired
    private ParticipantService _service;

    @GetMapping("/get/{participantId}")
    public ResponseEntity<?> participantId(@PathVariable String participantId) {
        return _service.getParticipantById(Long.parseLong(participantId));
    }

    @GetMapping("/get/phone/{phone}")
    public ResponseEntity<?> participantPhone(@PathVariable String phone) {
        return _service.getParticipantByPhone(phone);
    }

    @GetMapping("/get/email/{email}")
    public ResponseEntity<?> participantEmail(@PathVariable String email) {
        return _service.getParticipantByEmail(email);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addParticipant(@RequestBody ParticipantRequest request) {
        return _service.addParticipant(request);
    }

    @PutMapping("/update/{participantId}")
    public ResponseEntity<?> updateParticipant(@PathVariable Long participantId, @RequestBody ParticipantRequest request) {
        return _service.updateParticipant(participantId, request);
    }

    @DeleteMapping("/delete/{participantId}")
    public ResponseEntity<?> deleteParticipant(@PathVariable Long participantId) {
        return _service.deleteParticipant(participantId);
    }
}
