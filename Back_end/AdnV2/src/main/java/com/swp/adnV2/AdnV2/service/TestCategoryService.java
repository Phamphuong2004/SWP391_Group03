package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.TestCategoryRequest;
import com.swp.adnV2.AdnV2.dto.TestCategoryResponse;
import com.swp.adnV2.AdnV2.entity.Services;
import com.swp.adnV2.AdnV2.entity.TestCategory;
import com.swp.adnV2.AdnV2.repository.ServicesRepository;
import com.swp.adnV2.AdnV2.repository.TestCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TestCategoryService {
    @Autowired
    private TestCategoryRepository testCategoryRepository;

    @Autowired
    private ServicesRepository servicesRepository;

    public ResponseEntity<?> createTestCategory(TestCategoryRequest request) {
        if(request.getTestCategoryName() == null || request.getTestCategoryName().isEmpty())
            return ResponseEntity.badRequest().body("Test category name cannot be empty");
        if(request.getServiceName() == null || request.getServiceName().isEmpty())
            return ResponseEntity.badRequest().body("Service name cannot be empty");
        if(testCategoryRepository.existsByName(request.getTestCategoryName().trim()))
            return ResponseEntity.badRequest().body("Test category with this name already exists");
        Services service = servicesRepository.findByServiceName(request.getServiceName().trim());
        if (service == null)
            return ResponseEntity.badRequest().body("Service not found: " + request.getServiceName());

        TestCategory testCategory = new TestCategory();
        testCategory.setName(request.getTestCategoryName().trim());
        testCategory.setService(service);
        testCategory.setIsActive(request.getActive() != null ? request.getActive() : true);

        TestCategory savedTestCategory = testCategoryRepository.save(testCategory);
        return ResponseEntity.ok(convertToResponse(savedTestCategory));
    }

    public ResponseEntity<?> getTestCategoryById(Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().body("Test category id cannot be null");
        }
        Optional<TestCategory> testCategoryOpt = testCategoryRepository.findById(id);
        if (testCategoryOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Test category not found: " + id);
        }
        return ResponseEntity.ok(convertToResponse(testCategoryOpt.get()));
    }

    public ResponseEntity<?> updateTestCategory(Long id, TestCategoryRequest request) {
        Optional<TestCategory> testCategoryOpt = testCategoryRepository.findById(id);
        if (testCategoryOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Test category not found: " + id);
        }
        TestCategory testCategory = testCategoryOpt.get();
        if(request.getTestCategoryName() != null){
            String newName = request.getTestCategoryName().trim();
            if(newName.isEmpty()) {
                return ResponseEntity.badRequest().body("Test category name cannot be empty");
            }
            TestCategory existingCategory = testCategoryRepository.findByName(newName);
            if (existingCategory != null && !existingCategory.getId().equals(id)) {
                return ResponseEntity.badRequest().body("Test category with this name already exists");
            }
            testCategory.setName(newName);
        }
        if (request.getServiceName() != null) {
            Services service = servicesRepository.findByServiceName(request.getServiceName().trim());
            if (service == null) {
                return ResponseEntity.badRequest().body("Service not found: " + request.getServiceName());
            }
            testCategory.setService(service);
        }
        if (request.getActive() != null) {
            testCategory.setIsActive(request.getActive());
        }

        testCategoryRepository.save(testCategory);
        return ResponseEntity.ok(convertToResponse(testCategory));
    }

    public ResponseEntity<?> deleteTestCategory(Long id) {
        Optional<TestCategory> testCategoryOpt = testCategoryRepository.findById(id);
        if (testCategoryOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Test category not found: " + id);
        }
        TestCategory testCategory = testCategoryOpt.get();
        if (testCategory.getIsActive() != null && !testCategory.getIsActive()) {
            return ResponseEntity.badRequest().body("Test category already inactive");
        }
        testCategory.setIsActive(false);
        testCategoryRepository.save(testCategory);
        return ResponseEntity.ok("Delete successful");
    }

    public ResponseEntity<?> getTestCategoryByServiceNameAndActive(String serviceName){
        if (serviceName == null || serviceName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Service name cannot be empty");
        }
        List<TestCategory> categories = testCategoryRepository.findByService_ServiceNameAndIsActiveTrue(serviceName.trim());
        List<TestCategoryResponse> responseList = categories.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    public ResponseEntity<?> getTestCategoriesByServiceNameAll(String serviceName) {
        if (serviceName == null || serviceName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Service name cannot be empty");
        }
        List<TestCategory> categories = testCategoryRepository.findByService_ServiceName(serviceName.trim());
        List<TestCategoryResponse> responseList = categories.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }



    public TestCategoryResponse convertToResponse(TestCategory testCategory) {
        TestCategoryResponse response = new TestCategoryResponse();
        response.setId(testCategory.getId());
        response.setTestCategoryName(testCategory.getName());
        response.setServiceName(testCategory.getService() != null ? testCategory.getService().getServiceName() : null);
        response.setActive(testCategory.getIsActive());
        return response;
    }
}
