package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.Services;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServicesRepository extends JpaRepository<Services, Long> {
    List<Services> findServicesByServiceNameContainingIgnoreCase(String serviceName);
}
