package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface GuestRepository extends JpaRepository<Guest, Long> {
    @Query("SELECT ga.guest FROM GuestAppointment ga WHERE ga.appointment.appointmentId = :appointmentId")
    List<Guest> findGuestsByAppointmentId(@Param("appointmentId") Long appointmentId);

    Optional<Guest> findByPhone(String phone);
}
