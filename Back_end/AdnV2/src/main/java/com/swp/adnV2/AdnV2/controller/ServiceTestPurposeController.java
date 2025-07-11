package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.ServiceTestPurposeRequest;
import com.swp.adnV2.AdnV2.dto.ServiceTestPurposeResponse;
import com.swp.adnV2.AdnV2.entity.ServiceTestPurpose;
import com.swp.adnV2.AdnV2.service.ServiceTestPurposeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-test-purpose")
public class ServiceTestPurposeController {
    @Autowired
    private ServiceTestPurposeService serviceTestPurposeService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> createServiceTestPurpose(@RequestBody ServiceTestPurposeRequest request) {
        try {
            ServiceTestPurpose stp = serviceTestPurposeService.createServiceTestPurpose(request);
            ServiceTestPurposeResponse response = serviceTestPurposeService.convertToServiceTestPurposeResponse(stp);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }


    @PutMapping("/update/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> updateServiceTestPurpose(
            @PathVariable Long id,
            @RequestBody ServiceTestPurposeRequest request) {
        try {
            ServiceTestPurposeResponse response = serviceTestPurposeService.updateServiceTestPurpose(id, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyRole('MANAGER')")
    public ResponseEntity<?> deleteServiceTestPurpose(@PathVariable Long id) {
        try {
            serviceTestPurposeService.deleteServiceTestPurpose(id);
            return ResponseEntity.ok("Deleted successfully");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/by-service-name/{serviceName}")
    public ResponseEntity<?> getByServiceName(@PathVariable String serviceName) {
        try {
            List<ServiceTestPurposeResponse> list = serviceTestPurposeService.getByServiceName(serviceName);
            return ResponseEntity.ok(list);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/by-service-name-all/{serviceName}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> getByServiceNameAll(@PathVariable String serviceName) {
        try {
            List<ServiceTestPurposeResponse> list = serviceTestPurposeService.getByServiceNameAll(serviceName);
            return ResponseEntity.ok(list);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }


}
