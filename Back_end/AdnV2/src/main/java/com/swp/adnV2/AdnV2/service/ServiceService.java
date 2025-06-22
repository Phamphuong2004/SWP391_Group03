package com.swp.adnV2.AdnV2.service;
import com.swp.adnV2.AdnV2.dto.ServiceCreationRequest;
import com.swp.adnV2.AdnV2.dto.ServiceUpdateRequest;
import com.swp.adnV2.AdnV2.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ServiceService {
    @Autowired
    private ServiceRepository serviceRepository;

        // Create a new Service entity from the request

        // Save the service entity to the repository

    }

        // Update the service entity with the new values from the request

    }

    public void deleteService(Long serviceId) {
        // Delete a service by its ID
        serviceRepository.deleteById(serviceId);
    }

        // Retrieve all services from the repository
        return serviceRepository.findAll();
    }
        // Find a service by its ID
        return serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + serviceId));
    }
}
