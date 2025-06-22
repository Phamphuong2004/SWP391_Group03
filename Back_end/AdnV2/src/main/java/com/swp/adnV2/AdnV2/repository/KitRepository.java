package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.KitComponent;
import com.swp.adnV2.AdnV2.entity.Sample;
import com.swp.adnV2.AdnV2.entity.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface KitRepository extends JpaRepository<KitComponent, Long> {
    // Các phương thức liên quan đến KitComponent
    List<KitComponent> findByService(Services service);

    List<KitComponent> findByService_ServiceIdAndComponentNameContainingIgnoreCase(Long serviceId, String componentName);

    List<KitComponent> findByService_ServiceId(Long serviceId);
}
