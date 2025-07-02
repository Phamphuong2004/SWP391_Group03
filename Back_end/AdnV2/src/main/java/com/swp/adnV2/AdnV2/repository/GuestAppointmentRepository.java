package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.GuestAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GuestAppointmentRepository extends JpaRepository<GuestAppointment, Long> {
}
