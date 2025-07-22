package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.TestCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestCategoryRepository extends JpaRepository<TestCategory, Long> {
    boolean existsByName(String name);
    List<TestCategory> findByService_ServiceNameAndIsActiveTrue(String serviceName);
    List<TestCategory> findByService_ServiceName(String serviceName);
    TestCategory findByName(String name);
    List<TestCategory> findByService_ServiceId(Long serviceId);

}