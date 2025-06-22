package com.swp.adnV2.AdnV2.controller;

@PreAuthorize("hasRole('MANAGER')")
@RestController
@RequestMapping("/api/services")
public class ServiceAPI {
    @Autowired
    private ServiceService serviceService;

    @PostMapping("/create")
    Service1 createRequest1(@RequestBody ServiceCreationRequest request) {
        return serviceService.createRequest(request);
    }
    @GetMapping("/getList")
    List<Service1> getAllServices() {
        return serviceService.getAllServices();
    }

    @GetMapping("/{service_id}")
    Service1 getServiceById(@PathVariable("service_id") Long serviceId) {
        return serviceService.getServiceById(serviceId);
    }

    @PutMapping("/{service_id}")
    Service1 updateService(@PathVariable Long service_id, @RequestBody ServiceUpdateRequest request){
        return serviceService.updateService(service_id, request);
    }

    @DeleteMapping("/{service_id}")
    String deleteService(@PathVariable Long service_id) {
        serviceService.deleteService(service_id);
        return "Service has been deleted successfully";
    }
}
