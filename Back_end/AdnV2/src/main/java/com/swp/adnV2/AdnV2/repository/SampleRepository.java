package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.Sample;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SampleRepository extends JpaRepository<Sample, Long> {
    // Các phương thức liên quan đến Sample
    List<Sample> findByAppointment_AppointmentId(Long appointmentId);

    @Query("SELECT s FROM Sample s WHERE s.appointment.appointmentId = :appointmentId")
    List<Sample> findByAppointmentId(@Param("appointmentId") Long appointmentId);
}
