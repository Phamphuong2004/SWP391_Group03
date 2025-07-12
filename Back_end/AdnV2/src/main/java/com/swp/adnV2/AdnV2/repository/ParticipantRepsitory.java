package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.Participant;
import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParticipantRepsitory extends JpaRepository<Participant, Long> {
    Participant findByParticipantId(Long participantId);
    Participant findByPhone(String phone);
    Participant findByEmail(String email);
}
