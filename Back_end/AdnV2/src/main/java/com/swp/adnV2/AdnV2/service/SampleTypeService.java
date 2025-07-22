package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.SampleTypeCreateRequest;
import com.swp.adnV2.AdnV2.dto.SampleTypeResponse;
import com.swp.adnV2.AdnV2.dto.SampleTypeUpdateRequest;
import com.swp.adnV2.AdnV2.entity.CollectedSample;
import com.swp.adnV2.AdnV2.entity.KitComponent;
import com.swp.adnV2.AdnV2.entity.SampleType;
import com.swp.adnV2.AdnV2.repository.KitRepository;
import com.swp.adnV2.AdnV2.repository.SampleRepository;
import com.swp.adnV2.AdnV2.repository.SampleTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SampleTypeService {
    @Autowired
    SampleTypeRepository sampleTypeRepository;
    @Autowired
    KitRepository kitRepository;
    @Autowired
    SampleRepository sampleRepository;

    public void deleteSampleType(Long sampleTypeId) {
        // Check if the sample type exists
        if (!sampleTypeRepository.existsById(sampleTypeId)) {
            throw new RuntimeException("Sample type not found with id: " + sampleTypeId);
        }

        // Delete all samples associated with the sample type
        sampleRepository.deleteBySampleTypeId(sampleTypeId);

        // Finally, delete the sample type itself
        sampleTypeRepository.deleteById(sampleTypeId);
    }
    public SampleTypeResponse createSampleType(SampleTypeCreateRequest sampleType) {
        // Check if the sample type already exists by name
        if (sampleTypeRepository.existsByName(sampleType.getName())) {
            throw new RuntimeException("Sample type already exists with name: " + sampleType.getName());
        }
        // Create a new SampleType entity from the request
        SampleType newSampleType = new SampleType();
        newSampleType.setName(sampleType.getName());
        newSampleType.setDescription(sampleType.getDescription());
        KitComponent kitComponent = kitRepository.findByComponentName(sampleType.getComponentName());
        if (kitComponent == null) {
            throw new RuntimeException("Kit component not found with name: " + sampleType.getComponentName());
        }
        newSampleType.setKitComponent(kitComponent);
        List<CollectedSample> collectedSamples = sampleRepository.findBySampleTypeId(newSampleType.getId());
        if (collectedSamples != null && !collectedSamples.isEmpty()) {
            throw new RuntimeException("Sample type cannot be created as there are existing samples with this type.");
        }
        // Validate the sample type name and description
        if (newSampleType.getName() == null || newSampleType.getName().trim().isEmpty()) {
            throw new RuntimeException("Sample type name cannot be null or empty");
        }
        if (newSampleType.getDescription() == null || newSampleType.getDescription().trim().isEmpty()) {
            throw new RuntimeException("Sample type description cannot be null or empty");
        }
        // Save the new sample type to the repository
        sampleTypeRepository.save(newSampleType);
        // Create and return the response object
        SampleTypeResponse response = new SampleTypeResponse();
        response.setId(newSampleType.getId());
        response.setName(newSampleType.getName());
        response.setDescription(newSampleType.getDescription());
        response.setComponentName(newSampleType.getKitComponent().getComponentName());
        return response;
    }

    public String deleteSampleTypeByName(String sampleTypeName) {
        // Check if the sample type exists by name
        if (!sampleTypeRepository.existsByName(sampleTypeName)) {
            throw new RuntimeException("Sample type not found with name: " + sampleTypeName);
        }
        SampleType sampleType = sampleTypeRepository.findByName(sampleTypeName)
                .orElseThrow(() -> new RuntimeException("Sample type not found with name: " + sampleTypeName));
        deleteSampleType(sampleType.getId());
        // Delete the sample type by name
        return "Sample type with name " + sampleTypeName + " has been deleted successfully.";
    }
    public SampleTypeResponse getSampleTypeById(Long sampleTypeId) {
        // Retrieve the sample type by its ID
        SampleType sampleType = sampleTypeRepository.findById(sampleTypeId)
                .orElseThrow(() -> new RuntimeException("Sample type not found with id: " + sampleTypeId));
        // Create and return the response object
        SampleTypeResponse response = new SampleTypeResponse();
        response.setId(sampleType.getId());
        response.setName(sampleType.getName());
        response.setDescription(sampleType.getDescription());
        response.setComponentName(sampleType.getKitComponent().getComponentName());
        List<CollectedSample> collectedSamples = sampleRepository.findBySampleTypeId(sampleType.getId());
        List<Long> sampleIds = collectedSamples.stream()
                .map(CollectedSample::getSampleId)
                .toList();
        response.setSampleId(sampleIds);
        return response;
    }
    public SampleTypeResponse getSampleTypeByName(String sampleTypeName) {
        // Retrieve the sample type by its name
        SampleType sampleType = sampleTypeRepository.findByName(sampleTypeName)
                .orElseThrow(() -> new RuntimeException("Sample type not found with name: " + sampleTypeName));
        // Create and return the response object
        SampleTypeResponse response = new SampleTypeResponse();
        response.setId(sampleType.getId());
        response.setName(sampleType.getName());
        response.setDescription(sampleType.getDescription());
        response.setComponentName(sampleType.getKitComponent().getComponentName());
        List<CollectedSample> collectedSamples = sampleRepository.findBySampleTypeId(sampleType.getId());
        List<Long> sampleIds = collectedSamples.stream()
                .map(CollectedSample::getSampleId)
                .toList();
        response.setSampleId(sampleIds);
        return response;
    }
    public List<SampleTypeResponse> getAllSampleTypes() {
        // Retrieve all sample types from the repository
        List<SampleType> sampleTypes = sampleTypeRepository.findAll();
        if (sampleTypes.isEmpty()) {
            throw new RuntimeException("No sample types found");
        }
        // Map the sample types to response objects
        return sampleTypes.stream().map(sampleType -> {
            SampleTypeResponse response = new SampleTypeResponse();
            response.setId(sampleType.getId());
            response.setName(sampleType.getName());
            response.setDescription(sampleType.getDescription());
            response.setComponentName(sampleType.getKitComponent().getComponentName());
            List<CollectedSample> collectedSamples = sampleRepository.findBySampleTypeId(sampleType.getId());
            List<Long> sampleIds = collectedSamples.stream()
                    .map(CollectedSample::getSampleId)
                    .toList();
            response.setSampleId(sampleIds);
            return response;
        }).toList();
    }
    public SampleTypeResponse updateSampleType(Long sampleTypeId, SampleTypeUpdateRequest sampleTypeRequest) {
        // Retrieve the existing sample type
        SampleType existingSampleType = sampleTypeRepository.findById(sampleTypeId)
                .orElseThrow(() -> new RuntimeException("Sample type not found with id: " + sampleTypeId));
        SampleType nameSampleType = sampleTypeRepository.findByName(sampleTypeRequest.getName())
                .orElse(null);
        // Update the sample type's properties
        if (sampleTypeRequest.getName() != null && !sampleTypeRequest.getName().trim().isEmpty()) {
            if (nameSampleType != null && !nameSampleType.getId().equals(existingSampleType.getId())) {
                throw new RuntimeException("Sample type with name " + sampleTypeRequest.getName() + " already exists.");
            }
            existingSampleType.setName(sampleTypeRequest.getName());
        }
        if (sampleTypeRequest.getDescription() != null && !sampleTypeRequest.getDescription().trim().isEmpty()) {
            existingSampleType.setDescription(sampleTypeRequest.getDescription());
        }
        KitComponent kitComponent = kitRepository.findByComponentName(sampleTypeRequest.getComponentName());
        if (kitComponent == null) {
            throw new RuntimeException("Kit component not found with name: " + sampleTypeRequest.getComponentName());
        }
        existingSampleType.setKitComponent(kitComponent);

        // Save the updated sample type to the repository
        sampleTypeRepository.save(existingSampleType);
        // Create and return the response object
        SampleTypeResponse response = new SampleTypeResponse();
        response.setId(existingSampleType.getId());
        response.setName(existingSampleType.getName());
        response.setDescription(existingSampleType.getDescription());
        response.setComponentName(existingSampleType.getKitComponent().getComponentName());
        List<CollectedSample> collectedSamples = sampleRepository.findBySampleTypeId(existingSampleType.getId());
        List<Long> sampleIds = collectedSamples.stream()
                .map(CollectedSample::getSampleId)
                .toList();
        response.setSampleId(sampleIds);
        return response;
    }
    public List<SampleTypeResponse> getSampleTypeByComponentName(String componentName) {
        // Retrieve the sample type by its component name
        List<SampleType> sampleType = sampleTypeRepository.findByKitComponent_ComponentName(componentName);
        // Create and return the response object
        List<SampleTypeResponse> response = sampleTypeRepository.findByKitComponent_ComponentName(componentName)
                .stream()
                .map(type -> {
                    SampleTypeResponse sampleTypeResponse = new SampleTypeResponse();
                    sampleTypeResponse.setId(type.getId());
                    sampleTypeResponse.setName(type.getName());
                    sampleTypeResponse.setDescription(type.getDescription());
                    sampleTypeResponse.setComponentName(type.getKitComponent().getComponentName());
                    List<CollectedSample> collectedSamples = sampleRepository.findBySampleTypeId(type.getId());
                    List<Long> sampleIds = collectedSamples.stream()
                            .map(CollectedSample::getSampleId)
                            .toList();
                    sampleTypeResponse.setSampleId(sampleIds);
                    return sampleTypeResponse;
                })
                .toList();
        if (response.isEmpty()) {
            throw new RuntimeException("No sample types found with component name: " + componentName);
        }
        return response;
    }

}
