package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<Services, Long> {
    Services findServicesByServiceId(Long serviceId);
}
