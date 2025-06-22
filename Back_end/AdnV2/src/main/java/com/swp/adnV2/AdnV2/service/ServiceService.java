package com.swp.adnV2.AdnV2.service;
import com.swp.adnV2.AdnV2.dto.ServiceCreationRequest;
import com.swp.adnV2.AdnV2.dto.ServiceUpdateRequest;
import com.swp.adnV2.AdnV2.entity.Services;
import com.swp.adnV2.AdnV2.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ServiceService {
    @Autowired
    private ServiceRepository serviceRepository;

    public Services createRequest(ServiceCreationRequest request){
        // Create a new Service entity from the request
        Services services = new Services();
        services.setServiceName(request.getServiceName());
        services.setDescription(request.getDescription());
        services.setPrice(request.getPrice());

        // Save the service entity to the repository
        return serviceRepository.save(services);

    }

    public Services updateService( Long service_id, ServiceUpdateRequest request){
          Services services = getServiceById(service_id);
        // Update the service entity with the new values from the request
        services.setServiceName(request.getServiceName());
        services.setDescription(request.getDescription());
        services.setPrice(request.getPrice());

          return serviceRepository.save(services);
    }

    public void deleteService(Long serviceId) {
        // Delete a service by its ID
        serviceRepository.deleteById(serviceId);
    }

    public List<Services> getAllServices() {
        // Retrieve all services from the repository
        return serviceRepository.findAll();
    }
    public Services getServiceById(Long serviceId) {
        // Find a service by its ID
        return serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + serviceId));
    }
}
