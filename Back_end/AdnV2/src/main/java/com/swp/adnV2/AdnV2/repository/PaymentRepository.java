package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByAppointment_AppointmentId(Long appointmentId);
    // Additional query methods can be defined here if needed
}
