package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.TestPurposeRequest;
import com.swp.adnV2.AdnV2.dto.TestPurposeResponse;
import com.swp.adnV2.AdnV2.service.TestPurposeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-purpose")
public class TestPurposeController {
    @Autowired
    private TestPurposeService testPurposeService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public TestPurposeResponse createTestPurpose(@RequestBody TestPurposeRequest request) {
        return testPurposeService.createTestPurpose(request);
    }

    @GetMapping("/get-by-id/{testPurposeId}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public TestPurposeResponse getTestPurposeById(@PathVariable Long testPurposeId) {
        return testPurposeService.getTestPurposeById(testPurposeId);
    }

    @PutMapping("/update/{testPurposeId}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> updateTestPurpose(@PathVariable Long testPurposeId, @RequestBody TestPurposeRequest request) {
        return testPurposeService.updateTestPurpose(testPurposeId, request);
    }

    @DeleteMapping("/delete/{testPurposeId}")
    @PreAuthorize("hasAnyRole('MANAGER')")
    public ResponseEntity<?> deleteTestPurpose(@PathVariable Long testPurposeId) {
        testPurposeService.deleteTestPurpose(testPurposeId);
        return ResponseEntity.ok("Xóa thành công");
    }


}
