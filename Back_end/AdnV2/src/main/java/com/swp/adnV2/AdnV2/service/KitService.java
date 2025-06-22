package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.KitComponentRequest;
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

@Service
public class KitService {
    @Autowired
    private KitRepository kitRepository;

    @Autowired
    private ServicesRepository servicesRepository;

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
                return ResponseEntity.ok(kitComponents);
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

    public ResponseEntity<?> updateKitComponent(Long serviceId, Long kitComponentId,
                                                KitComponentRequest request) {
        try {
            Optional<Services> serviceOptional = servicesRepository.findById(serviceId);
            if (!serviceOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Service with ID: " + serviceId + " not found");
            }

            Optional<KitComponent> kitComponentOptional = kitRepository.findById(kitComponentId);
            if (!kitComponentOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Kit component with ID: " + kitComponentId + " not found");
            }

            // Kiểm tra KitComponent có thuộc về Service này không
            KitComponent kitComponent = kitComponentOptional.get();
            if (kitComponent.getService() == null ||
                    !kitComponent.getService().getServiceId().equals(serviceId)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Kit component with ID: " + kitComponentId +
                                " does not belong to Service with ID: " + serviceId);
            }

            // Cập nhật thông tin KitComponent
            if (request != null) {
                if (request.getComponentName() != null) {
                    kitComponent.setComponentName(request.getComponentName());
                }

                if (request.getQuantity() > 0) {
                    kitComponent.setQuantity(request.getQuantity());
                }

                if (request.getIntruction() != null) {
                    kitComponent.setIntroduction(request.getIntruction());
                }
            }

            kitRepository.save(kitComponent);
            return ResponseEntity.ok("Kit component updated successfully");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating kit component: " + e.getMessage());
        }
    }

    public ResponseEntity<?> deleteKitComponent(Long serviceId, Long kitComponentId) {
        try {
            // Kiểm tra Service tồn tại
            Optional<Services> serviceOptional = servicesRepository.findById(serviceId);
            if (!serviceOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Service with ID: " + serviceId + " not found");
            }

            // Kiểm tra KitComponent tồn tại
            Optional<KitComponent> kitComponentOptional = kitRepository.findById(kitComponentId);
            if (!kitComponentOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Kit component with ID: " + kitComponentId + " not found");
            }

            // Kiểm tra KitComponent có thuộc về Service này không
            KitComponent kitComponent = kitComponentOptional.get();
            if (kitComponent.getService() == null ||
                    !kitComponent.getService().getServiceId().equals(serviceId)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Kit component with ID: " + kitComponentId +
                                " does not belong to Service with ID: " + serviceId);
            }

            // Xóa KitComponent
            kitRepository.delete(kitComponent);
            return ResponseEntity.ok("Kit component deleted successfully");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting kit component: " + e.getMessage());
        }
    }

}
