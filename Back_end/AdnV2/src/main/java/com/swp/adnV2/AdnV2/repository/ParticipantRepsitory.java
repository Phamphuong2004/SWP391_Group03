package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParticipantRepsitory extends JpaRepository<Participant, Long> {
    List<Participant> findByAppointment_AppointmentId(Long appointmentId);
}
