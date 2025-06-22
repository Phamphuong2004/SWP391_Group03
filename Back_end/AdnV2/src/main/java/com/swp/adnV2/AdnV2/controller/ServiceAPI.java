package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.ServiceCreationRequest;
import com.swp.adnV2.AdnV2.dto.ServiceUpdateRequest;
import com.swp.adnV2.AdnV2.entity.Services;
import com.swp.adnV2.AdnV2.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/services")
public class ServiceAPI {
    @Autowired
    private ServiceService serviceService;

    @PostMapping("/create")
    Services createRequest1(@RequestBody ServiceCreationRequest request) {
        return serviceService.createRequest(request);
    }
    @GetMapping("/getList")
    List<Services> getAllServices() {
        return serviceService.getAllServices();
    }

    @GetMapping("/{service_id}")
    Services getServiceById(@PathVariable("service_id") Long serviceId) {
        return serviceService.getServiceById(serviceId);
    }
    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/{service_id}")
    Services updateService(@PathVariable Long service_id, @RequestBody ServiceUpdateRequest request){
        return serviceService.updateService(service_id, request);
    }
    @PreAuthorize("hasRole('MANAGER')")
    @DeleteMapping("/{service_id}")
    String deleteService(@PathVariable Long service_id) {
        serviceService.deleteService(service_id);
        return "Service has been deleted successfully";
    }
}
