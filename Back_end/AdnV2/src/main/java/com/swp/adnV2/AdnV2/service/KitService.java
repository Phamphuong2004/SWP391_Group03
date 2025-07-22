package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.KitComponentRequest;
import com.swp.adnV2.AdnV2.dto.KitComponentResponse;
import com.swp.adnV2.AdnV2.entity.KitComponent;
import com.swp.adnV2.AdnV2.entity.Services;
import com.swp.adnV2.AdnV2.repository.KitRepository;
import com.swp.adnV2.AdnV2.repository.ServicesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class KitService {
    @Autowired
    private KitRepository kitRepository;

    @Autowired
    private ServicesRepository servicesRepository;

    public KitComponentResponse convertToResponse(KitComponent kitComponent) {
        KitComponentResponse response = new KitComponentResponse();
        Services service = kitComponent.getService();
        response.setServiceName(service.getServiceName());
        response.setKitComponentId(kitComponent.getKitComponentId());
        response.setKitComponentName(kitComponent.getComponentName());
        response.setIntroduction(kitComponent.getIntroduction());
        response.setQuantity(kitComponent.getQuantity());
        return response;
    }

    public ResponseEntity<?> getKitByServiceId(Long serviceId) {
        try {
            Optional<Services> serviceOptional = servicesRepository.findById(serviceId);
            if (!serviceOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Service with ID: " + serviceId + " not found");
            }

            Services service = serviceOptional.get();

            // Thay đổi để lấy danh sách KitComponent
            List<KitComponent> kitComponents = kitRepository.findByService(service);

            if (!kitComponents.isEmpty()) {
                // Chuyển đổi sang response
                List<KitComponentResponse> responseList = kitComponents.stream()
                        .map(this::convertToResponse)
                        .collect(Collectors.toList());
                return ResponseEntity.ok(responseList);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No kit components found for service ID: " + serviceId);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving kit components: " + e.getMessage());
        }
    }

    public ResponseEntity<?> createKitByServiceId(Long serviceId, KitComponentRequest kitComponentRequest) {
        try{
            Optional<Services> serviceOptional = servicesRepository.findById(serviceId);
            if (!serviceOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Service with ID: " + serviceId + " not found");
            }

            KitComponent kitComponent = new KitComponent();
            kitComponent.setComponentName(kitComponentRequest.getComponentName());
            kitComponent.setQuantity(kitComponentRequest.getQuantity());
            kitComponent.setIntroduction(kitComponentRequest.getIntruction());
            kitComponent.setService(serviceOptional.get());

            kitRepository.save(kitComponent);
            return ResponseEntity.status(HttpStatus.CREATED).body("Kit component created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating kit component: " + e.getMessage());
        }
    }

    public ResponseEntity<?> updateKitComponent(Long kitComponentId, KitComponentRequest request) {
        Optional<KitComponent> kitComponentOptional = kitRepository.findById(kitComponentId);
        if (!kitComponentOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Kit component with ID: " + kitComponentId + " not found");
        }
        KitComponent kitComponent = kitComponentOptional.get();

        // Cập nhật thông tin KitComponent
        if (request != null) {
            if (request.getComponentName() != null && !request.getComponentName().trim().isEmpty()) {
                kitComponent.setComponentName(request.getComponentName());
            }
            if (request.getQuantity() > 0) {
                kitComponent.setQuantity(request.getQuantity());
            }
            if (request.getIntruction() != null && !request.getIntruction().trim().isEmpty()) {
                kitComponent.setIntroduction(request.getIntruction());
            }
        }

        kitRepository.save(kitComponent);
        return ResponseEntity.ok("Kit component updated successfully");
    }

    public ResponseEntity<?> deleteKitComponent(Long kitComponentId) {
        Optional<KitComponent> kitComponentOptional = kitRepository.findById(kitComponentId);
        if (!kitComponentOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Kit component with ID: " + kitComponentId + " not found");
        }
        try {
            kitRepository.deleteById(kitComponentId);
            return ResponseEntity.ok("Kit component deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting kit component: " + e.getMessage());
        }
    }

}
