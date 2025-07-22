package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.AppointmentResponse;
import com.swp.adnV2.AdnV2.dto.ParticipantRequest;
import com.swp.adnV2.AdnV2.dto.ParticipantResponse;
import com.swp.adnV2.AdnV2.entity.Participant;
import com.swp.adnV2.AdnV2.repository.ParticipantRepsitory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class ParticipantService {
    @Autowired
    private ParticipantRepsitory participantRepository;

    public ParticipantResponse convertToParticipantResponse(Participant participant) {
        ParticipantResponse participantResponse = new ParticipantResponse();
        participantResponse.setParticipantId(participant.getParticipantId());
        participantResponse.setFullName(participant.getFullName());
        participantResponse.setGender(participant.getGender());
        participantResponse.setDateOfBirth(participant.getDateOfBirth());
        participantResponse.setPhoneNumber(participant.getPhone());
        participantResponse.setEmail(participant.getEmail());
        return participantResponse;
    }

    public ResponseEntity<?> getParticipantById(Long participantId) {
        ParticipantResponse response = convertToParticipantResponse(participantRepository.findByParticipantId(participantId));
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> getParticipantByPhone(String phone) {
        Participant participant = participantRepository.findByPhone(phone);
        if (participant == null) {
            return ResponseEntity.notFound().build();
        }
        ParticipantResponse response = convertToParticipantResponse(participant);
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> getParticipantByEmail(String email) {
        Participant participant = participantRepository.findByEmail(email);
        if (participant == null) {
            return ResponseEntity.notFound().build();
        }
        ParticipantResponse response = convertToParticipantResponse(participant);
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> addParticipant(ParticipantRequest request){
        Participant participant = new Participant();
        participant.setFullName(request.getFullName());
        participant.setGender(request.getGender());
        participant.setDateOfBirth(request.getDateOfBirth());
        participant.setPhone(request.getPhoneNumber());
        participant.setEmail(request.getEmail());
        participantRepository.save(participant);
        return ResponseEntity.ok("Created participant successfully");
    }

    public ResponseEntity<?> updateParticipant(Long participantId, ParticipantRequest request) {
        Participant participant = participantRepository.findByParticipantId(participantId);
        if (participant == null) {
            return ResponseEntity.notFound().build();
        }
        participant.setFullName(request.getFullName());
        participant.setGender(request.getGender());
        participant.setDateOfBirth(request.getDateOfBirth());
        participant.setPhone(request.getPhoneNumber());
        participant.setEmail(request.getEmail());
        participantRepository.save(participant);
        return ResponseEntity.ok("Updated participant successfully");
    }

    public ResponseEntity<?> deleteParticipant(Long participantId) {
        Participant participant = participantRepository.findByParticipantId(participantId);
        if (participant == null) {
            return ResponseEntity.notFound().build();
        }
        participantRepository.delete(participant);
        return ResponseEntity.ok("Deleted participant successfully");
    }
}
