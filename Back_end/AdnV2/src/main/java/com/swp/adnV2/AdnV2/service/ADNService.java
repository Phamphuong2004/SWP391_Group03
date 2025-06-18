package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.ServicesResponse;
import com.swp.adnV2.AdnV2.entity.Services;
import com.swp.adnV2.AdnV2.repository.ServicesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ADNService {
    @Autowired
    private ServicesRepository servicesRepository;

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
