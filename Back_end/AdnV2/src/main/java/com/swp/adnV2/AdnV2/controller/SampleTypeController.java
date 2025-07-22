package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.SampleTypeCreateRequest;
import com.swp.adnV2.AdnV2.dto.SampleTypeResponse;
import com.swp.adnV2.AdnV2.dto.SampleTypeUpdateRequest;
import com.swp.adnV2.AdnV2.service.SampleTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sample-types")
public class SampleTypeController {
    @Autowired
    private SampleTypeService sampleTypeService;
    // Define endpoints for SampleTypeController here

    @PostMapping("/create")
    public SampleTypeResponse createSampleType(@RequestBody SampleTypeCreateRequest sampleType) {
        return sampleTypeService.createSampleType(sampleType);
    }
    // Add other endpoints as needed, such as update, delete, get by ID, etc.
    @GetMapping("/all")
    public List<SampleTypeResponse> getAllSampleTypes() {
        return sampleTypeService.getAllSampleTypes();
    }
    @GetMapping("/get-by-id/{id}")
    public SampleTypeResponse getSampleTypeById(@RequestParam Long sampleTypeId) {
        return sampleTypeService.getSampleTypeById(sampleTypeId);
    }
    @DeleteMapping("/delete/{id}")
    public String deleteSampleType(@RequestParam Long sampleTypeId) {
        sampleTypeService.deleteSampleType(sampleTypeId);
        return "Sample type deleted successfully";
    }
    @DeleteMapping("/delete-by-name/{name}")
    public String deleteSampleTypeByName(@RequestParam String name) {
        sampleTypeService.deleteSampleTypeByName(name);
        return "Sample type deleted successfully";
    }
    @PostMapping("/update/{id}")
    public SampleTypeResponse updateSampleType(@PathVariable Long sampleTypeId, @RequestBody SampleTypeUpdateRequest sampleType) {
        return sampleTypeService.updateSampleType(sampleTypeId, sampleType);
    }
    @GetMapping("/get-by-name/{name}")
    public SampleTypeResponse getSampleTypeByName(@RequestParam String name) {
        return sampleTypeService.getSampleTypeByName(name);
    }

    @GetMapping("/get-by-component-name/{componentName}")
    public List<SampleTypeResponse> getSampleTypeByComponentName(@PathVariable String componentName) {
        return sampleTypeService.getSampleTypeByComponentName(componentName);
    }
}
