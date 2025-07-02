package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.KitComponent;
import com.swp.adnV2.AdnV2.entity.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface KitRepository extends JpaRepository<KitComponent, Long> {
    // Các phương thức liên quan đến KitComponent
    List<KitComponent> findByService(Services service);

    List<KitComponent> findByService_ServiceIdAndComponentNameContainingIgnoreCase(Long serviceId, String componentName);

    List<KitComponent> findByService_ServiceId(Long serviceId);

    KitComponent findByComponentName(String componentName);

    Optional<KitComponent> findByComponentNameIgnoreCase(String componentName);
}
