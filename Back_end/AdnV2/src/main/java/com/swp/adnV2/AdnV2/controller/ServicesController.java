package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.ServicesRequest;
import com.swp.adnV2.AdnV2.service.ADNService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/services")
public class ServicesController {
    @Autowired
    private ADNService adnService;

    @GetMapping("/view-all-service")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> viewAllServices() {
        return adnService.viewAllServices();
    }

    @GetMapping("/search-by-name")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> searchByName(@RequestParam(required = false) String name) {
        return adnService.searchByName(name);
    }

    @PostMapping("/add-service")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> addService(@RequestBody ServicesRequest servicesRequest) {
        return adnService.createService(servicesRequest);
    }

    @PutMapping("/update-service/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> updateService(@PathVariable String id, @RequestBody ServicesRequest servicesRequest) {
        return adnService.updateService(id, servicesRequest);
    }

    @DeleteMapping("/delete-service/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> deleteService(@PathVariable String id) {
        return adnService.deleteService(id);
    }
}
