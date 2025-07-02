package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.CollectedSample;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface SampleRepository extends JpaRepository<CollectedSample, Long> {
    // Các phương thức liên quan đến Sample
    List<CollectedSample> findByAppointment_AppointmentId(Long appointmentId);
    void deleteBySampleTypeId(Long sampleTypeId);
    List<CollectedSample> findBySampleTypeId(Long sampleTypeId);
}
