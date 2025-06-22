package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.KitComponent;
import com.swp.adnV2.AdnV2.entity.Services;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface KitRepository extends JpaRepository<KitComponent, Long> {
    List<KitComponent> findByService(Services service);

    List<KitComponent> findByService_ServiceIdAndComponentNameContainingIgnoreCase(Long serviceId, String componentName);
}
