package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.ServicesRequest;
import com.swp.adnV2.AdnV2.dto.ServicesResponse;
import com.swp.adnV2.AdnV2.entity.Services;
import com.swp.adnV2.AdnV2.repository.ServicesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ADNService {
    @Autowired
    private ServicesRepository servicesRepository;

    @Autowired
    private YourTrackService yourTrackService;

    public ResponseEntity<?> deleteService(String id) {
        try {
            Long serviceId = Long.parseLong(id);
            Optional<Services> optionalServices = servicesRepository.findById(serviceId);
            if (!optionalServices.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            servicesRepository.deleteById(serviceId);
            return ResponseEntity.ok("Service deleted successfully");
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid service ID format");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting service: " + e.getMessage());
        }
    }

    public ResponseEntity<?> updateService(String id ,ServicesRequest servicesRequest) {
        try {
            Long serviceId = Long.parseLong(id);
            Optional<Services> optionalServices = servicesRepository.findById(serviceId);
            if (!optionalServices.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Services services = optionalServices.get();
            services.setServiceName(servicesRequest.getServicesName());
            services.setDescription(servicesRequest.getDescription());
            services.setPrice(servicesRequest.getPrice());

            servicesRepository.save(services);
            return ResponseEntity.ok("Service updated successfully");
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid service ID format");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating service: " + e.getMessage());
        }
    }

    public ResponseEntity<?> createService(ServicesRequest servicesRequest) {
        try {
            // Validation
            if (servicesRequest.getServicesName() == null || servicesRequest.getServicesName().trim().isEmpty()) {
                try {
                    String summary = "Tạo service thiếu tên";
                    String description = "Service name null hoặc rỗng"
                            + "\nPrice: " + servicesRequest.getPrice()
                            + "\nDescription: " + servicesRequest.getDescription();
                    yourTrackService.createIssue(summary, description);
                } catch (Exception ex) {
                    // Log error if needed
                }
                return ResponseEntity.badRequest().body("Service name is required");
            }

            if (servicesRequest.getPrice() <= 0) {
                try {
                    String summary = "Tạo service giá không hợp lệ";
                    String description = "Service name: " + servicesRequest.getServicesName()
                            + "\nPrice: " + servicesRequest.getPrice()
                            + "\nDescription: " + servicesRequest.getDescription();
                    yourTrackService.createIssue(summary, description);
                } catch (Exception ex) {
                    // Log error if needed
                }
                return ResponseEntity.badRequest().body("Price must be greater than 0");
            }

            Services services = new Services();
            services.setServiceName(servicesRequest.getServicesName());
            services.setDescription(servicesRequest.getDescription());
            services.setPrice(servicesRequest.getPrice());

            servicesRepository.save(services);

            try {
                String summary = "Dịch vụ mới: " + servicesRequest.getServicesName();
                String description = "Tên dịch vụ: " + servicesRequest.getServicesName()
                        + "\nMô tả: " + servicesRequest.getDescription()
                        + "\nGiá: " + servicesRequest.getPrice();
                yourTrackService.createIssue(summary, description);
            } catch (Exception ex) {
                // Log error if needed
            }

            return ResponseEntity.ok("Service created successfully");
        } catch (Exception e) {
            try {
                String summary = "Exception tạo service - " + servicesRequest.getServicesName();
                String description = "Lỗi: " + e.getMessage()
                        + "\nService name: " + servicesRequest.getServicesName()
                        + "\nPrice: " + servicesRequest.getPrice()
                        + "\nDescription: " + servicesRequest.getDescription()
                        + "\nStackTrace: " + e.getClass().getSimpleName();
                yourTrackService.createIssue(summary, description);
            } catch (Exception ex) {
                // Log error if needed
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating service: " + e.getMessage());
        }
    }

    public ResponseEntity<?> searchByName(String name){
        if (name == null || name.isEmpty()){
            return ResponseEntity.ok(viewAllServices());
        }
        List<Services> servicesList = servicesRepository.findServicesByServiceNameContainingIgnoreCase(name);
        if (servicesList.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        List<ServicesResponse> servicesResponse = servicesList.stream()
                .map(this::convetToServicesResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(servicesResponse);
    }

    public ServicesResponse convetToServicesResponse(Services services) {
        ServicesResponse servicesResponse = new ServicesResponse();
        servicesResponse.setServiceId(services.getServiceId());
        servicesResponse.setServicesName(services.getServiceName());
        servicesResponse.setDescription(services.getDescription());
        servicesResponse.setPrice(services.getPrice());
        return servicesResponse;
    }

    public ResponseEntity<?> viewAllServices(){
        List<Services> servicesList = servicesRepository.findAll();
        if (servicesList.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        List<ServicesResponse> servicesResponse = servicesList.stream()
                .map(this::convetToServicesResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(servicesResponse);
    }
}
