package com.swp.adnV2.AdnV2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.swp.adnV2.AdnV2.entity.Result;


@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    Result findByCollectedSample_SampleId(Long sampleId);
    Result findByAppointment_AppointmentId(Long appointmentId);
}
