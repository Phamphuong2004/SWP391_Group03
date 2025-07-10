    package com.swp.adnV2.AdnV2.service;

    import com.swp.adnV2.AdnV2.dto.ServiceTestPurposeRequest;
    import com.swp.adnV2.AdnV2.dto.ServiceTestPurposeResponse;
    import com.swp.adnV2.AdnV2.entity.ServiceTestPurpose;
    import com.swp.adnV2.AdnV2.entity.Services;
    import com.swp.adnV2.AdnV2.entity.TestPurpose;
    import com.swp.adnV2.AdnV2.repository.ServiceTestPurposeRepository;
    import com.swp.adnV2.AdnV2.repository.ServicesRepository;
    import com.swp.adnV2.AdnV2.repository.TestPurposeRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.stereotype.Service;

    import java.util.List;
    import java.util.stream.Collectors;

    @Service
    public class ServiceTestPurposeService {
        @Autowired
        private ServiceTestPurposeRepository serviceTestPurposeRepository;

        @Autowired
        private ServicesRepository servicesRepository;

        @Autowired
        private TestPurposeRepository testPurposeRepository;

        public ServiceTestPurpose  createServiceTestPurpose(ServiceTestPurposeRequest request) {
            if (request == null) {
                throw new IllegalArgumentException("Request is null");
            }
            if (request.getServiceName() == null || request.getServiceName().isBlank()) {
                throw new IllegalArgumentException("Service name is required");
            }
            if (request.getTestPurposeName() == null || request.getTestPurposeName().isBlank()) {
                throw new IllegalArgumentException("Test purpose name is required");
            }
            Services service = servicesRepository.findByServiceName(request.getServiceName());
            if (service == null) {
                throw new IllegalArgumentException("Service not found");
            }

            TestPurpose testPurpose = testPurposeRepository.findByTestPurposeName(request.getTestPurposeName());
            if (testPurpose == null) {
                throw new IllegalArgumentException("Test purpose not found");
            }

            if (serviceTestPurposeRepository.existsByServiceAndTestPurpose(service, testPurpose)) {
                throw new IllegalArgumentException("This relation already exists");
            }

            ServiceTestPurpose stp = new ServiceTestPurpose();
            stp.setService(service);
            stp.setTestPurpose(testPurpose);
            stp.setActive(true);
            return serviceTestPurposeRepository.save(stp);
        }

        public ServiceTestPurposeResponse updateServiceTestPurpose(Long id, ServiceTestPurposeRequest request) {
            ServiceTestPurpose stp = serviceTestPurposeRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("ServiceTestPurpose not found"));

            Services service = servicesRepository.findByServiceName(request.getServiceName());
            if (service == null) {
                throw new IllegalArgumentException("Service not found");
            }

            TestPurpose testPurpose = testPurposeRepository.findByTestPurposeName(request.getTestPurposeName());
            if (testPurpose == null) {
                throw new IllegalArgumentException("Test purpose not found");
            }

            boolean exists = serviceTestPurposeRepository.existsByServiceAndTestPurposeAndIdNot(service, testPurpose, id);
            if (exists) {
                throw new IllegalArgumentException("This relation already exists");
            }

            stp.setService(service);
            stp.setTestPurpose(testPurpose);
            stp = serviceTestPurposeRepository.save(stp);
            return convertToServiceTestPurposeResponse(stp);
        }

        public void deleteServiceTestPurpose(Long id) {
            ServiceTestPurpose stp = serviceTestPurposeRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("ServiceTestPurpose not found"));
            stp.setActive(false);
            serviceTestPurposeRepository.save(stp);
        }

        public ServiceTestPurposeResponse convertToServiceTestPurposeResponse(ServiceTestPurpose serviceTestPurpose) {
            if (serviceTestPurpose == null) {
                return null;
            }
            ServiceTestPurposeResponse response = new ServiceTestPurposeResponse();
            response.setId(serviceTestPurpose.getId());
            response.setServiceName(serviceTestPurpose.getService().getServiceName());
            response.setTestPurposeName(serviceTestPurpose.getTestPurpose().getTestPurposeName());
            response.setActive(serviceTestPurpose.getActive());
            return response;
        }

        public List<ServiceTestPurposeResponse> getByServiceName(String serviceName) {
            Services service = servicesRepository.findByServiceName(serviceName);
            if (service == null) {
                throw new IllegalArgumentException("Service not found");
            }
            List<ServiceTestPurpose> list = serviceTestPurposeRepository.findByServiceAndIsActiveTrue(service);
            return list.stream()
                    .map(this::convertToServiceTestPurposeResponse)
                    .collect(Collectors.toList());
        }

        public List<ServiceTestPurposeResponse> getByServiceNameAll(String serviceName) {
            Services service = servicesRepository.findByServiceName(serviceName);
            if (service == null) {
                throw new IllegalArgumentException("Service not found");
            }
            List<ServiceTestPurpose> list = serviceTestPurposeRepository.findByService(service);
            return list.stream()
                    .map(this::convertToServiceTestPurposeResponse)
                    .collect(Collectors.toList());
        }
    }
