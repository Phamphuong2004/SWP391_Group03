package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.ServiceTestPurpose;
import com.swp.adnV2.AdnV2.entity.Services;
import com.swp.adnV2.AdnV2.entity.TestPurpose;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceTestPurposeRepository extends JpaRepository<ServiceTestPurpose, Long> {
    List<ServiceTestPurpose> findAllByService_ServiceName(String serviceName);
    ServiceTestPurpose findByServiceAndTestPurpose(Services service, TestPurpose testPurpose);
    List<ServiceTestPurpose> findAllByService_ServiceNameAndIsActiveTrue(String serviceName);

    boolean existsByServiceAndTestPurpose(Services service, TestPurpose testPurpose);

    List<ServiceTestPurpose> findByServiceAndIsActiveTrue(Services service);

    List<ServiceTestPurpose> findByService(Services service);

    List<ServiceTestPurpose> findAllByTestPurpose(TestPurpose testPurpose);

    boolean existsByServiceAndTestPurposeAndIdNot(Services service, TestPurpose testPurpose, Long id);
}
