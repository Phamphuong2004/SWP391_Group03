package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.TestCategoryRequest;
import com.swp.adnV2.AdnV2.service.TestCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test-category")
public class TestCategoryController {
    @Autowired
    private TestCategoryService testCategoryService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> createTestCategory(@RequestBody TestCategoryRequest request) {
        return testCategoryService.createTestCategory(request);
    }

    @GetMapping("/get-by-id/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> getTestCategoryById(@PathVariable Long id) {
        return testCategoryService.getTestCategoryById(id);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> updateTestCategory(@PathVariable Long id, @RequestBody TestCategoryRequest request) {
        return testCategoryService.updateTestCategory(id, request);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyRole('MANAGER')")
    public ResponseEntity<?> deleteTestCategory(@PathVariable Long id) {
        return testCategoryService.deleteTestCategory(id);
    }

    @GetMapping("/by-service/active")
    public ResponseEntity<?> getActiveTestCategoriesByServiceName(@RequestParam String serviceName) {
        return testCategoryService.getTestCategoryByServiceNameAndActive(serviceName);
    }

    @GetMapping("/by-service/all")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> getAllTestCategoriesByServiceName(@RequestParam String serviceName) {
        return testCategoryService.getTestCategoriesByServiceNameAll(serviceName);
    }
}
