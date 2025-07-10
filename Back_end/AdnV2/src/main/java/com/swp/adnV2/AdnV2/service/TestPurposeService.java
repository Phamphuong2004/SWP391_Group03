package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.TestPurposeRequest;
import com.swp.adnV2.AdnV2.dto.TestPurposeResponse;
import com.swp.adnV2.AdnV2.entity.ServiceTestPurpose;
import com.swp.adnV2.AdnV2.entity.Services;
import com.swp.adnV2.AdnV2.entity.TestPurpose;
import com.swp.adnV2.AdnV2.repository.ServiceTestPurposeRepository;
import com.swp.adnV2.AdnV2.repository.ServicesRepository;
import com.swp.adnV2.AdnV2.repository.TestPurposeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TestPurposeService {
    @Autowired
    private TestPurposeRepository testPurposeRepository;

    @Autowired
    private ServicesRepository servicesRepository;

    @Autowired
    private ServiceTestPurposeRepository serviceTestPurposeRepository;

    public TestPurposeResponse convertToTestPurposeResponse(TestPurpose testPurpose) {
        if (testPurpose == null) return null;
        TestPurposeResponse response = new TestPurposeResponse();
        response.setId(testPurpose.getId());
        response.setPurposeName(testPurpose.getTestPurposeName());
        response.setTestPurposeDescription(testPurpose.getTestPurposeDescription());
        response.setActive(testPurpose.getIsActive());
        return response;
    }


    public TestPurposeResponse createTestPurpose(TestPurposeRequest request) {
        if (request.getTestPurposeName() == null || request.getTestPurposeName().trim().isEmpty()) {
            throw new IllegalArgumentException("Test purpose name must not be empty");
        }
        TestPurpose existing = testPurposeRepository.findByTestPurposeName(request.getTestPurposeName());
        if (existing != null) {
            throw new IllegalArgumentException("Test purpose name already exists: " + request.getTestPurposeName());
        }

        TestPurpose testPurpose = new TestPurpose();
        testPurpose.setTestPurposeName(request.getTestPurposeName().trim());
        testPurpose.setTestPurposeDescription(request.getTestPurposeDescription());
        testPurpose.setIsActive(true);
        testPurpose = testPurposeRepository.save(testPurpose);

        return convertToTestPurposeResponse(testPurpose);
    }

    public TestPurposeResponse getTestPurposeById(Long id) {
        Optional<TestPurpose> testPurposeOpt = testPurposeRepository.findById(id);
        if (testPurposeOpt.isEmpty())
            throw new IllegalArgumentException("TestPurpose not found: " + id);
        return convertToTestPurposeResponse(testPurposeOpt.get());
    }

    public ResponseEntity<?> updateTestPurpose(Long id, TestPurposeRequest request) {
        if (id == null) {
            throw new IllegalArgumentException("TestPurpose id must not be null");
        }
        Optional<TestPurpose> testPurposeOpt = testPurposeRepository.findById(id);
        if (testPurposeOpt.isEmpty()) {
            throw new IllegalArgumentException("TestPurpose not found: " + id);
        }
        TestPurpose testPurpose = testPurposeOpt.get();

        if (request.getTestPurposeName() != null) {
            String newName = request.getTestPurposeName().trim();
            if (newName.isEmpty()) {
                throw new IllegalArgumentException("Test purpose name must not be empty");
            }

            TestPurpose existing = testPurposeRepository.findByTestPurposeName(newName);
            if (existing != null && !existing.getId().equals(id)) {
                throw new IllegalArgumentException("Test purpose name already exists: " + newName);
            }
            testPurpose.setTestPurposeName(newName);
        }
        if (request.getTestPurposeDescription() != null) {
            testPurpose.setTestPurposeDescription(request.getTestPurposeDescription());
        }

        if (request.getActive() != null) {
            testPurpose.setIsActive(request.getActive());
        }
        testPurposeRepository.save(testPurpose);
        return ResponseEntity.ok("Update successful");
    }

    public void deleteTestPurpose(Long testPurposeId) {
        Optional<TestPurpose> testPurposeOpt = testPurposeRepository.findById(testPurposeId);
        if (testPurposeOpt.isEmpty()) {
            throw new IllegalArgumentException("TestPurpose not found: " + testPurposeId);
        }

        TestPurpose testPurpose = testPurposeOpt.get();
        if (Boolean.FALSE.equals(testPurpose.getIsActive())) {
            throw new IllegalArgumentException("TestPurpose is already inactive: " + testPurposeId);
        }

        testPurpose.setIsActive(false);
        testPurposeRepository.save(testPurpose);

        // Deactivate all ServiceTestPurpose relations of this TestPurpose
        List<ServiceTestPurpose> stpList = serviceTestPurposeRepository.findAllByTestPurpose(testPurpose);
        for (ServiceTestPurpose stp : stpList) {
            stp.setActive(false);
        }
        serviceTestPurposeRepository.saveAll(stpList);
    }
}
