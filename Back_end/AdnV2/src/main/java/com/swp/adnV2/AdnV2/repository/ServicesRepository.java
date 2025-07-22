package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ServicesRepository extends JpaRepository<Services, Long> {
    List<Services> findServicesByServiceNameContainingIgnoreCase(String serviceName);

    Services findServicesByServiceId(Long serviceId);

    Services findByServiceName(String serviceName);
}