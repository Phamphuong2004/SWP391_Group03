package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.SampleRequest;
import com.swp.adnV2.AdnV2.service.SampleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sample")
public class SampleController {
    @Autowired
    private SampleService sampleService;

    @PostMapping("/create/{appointmentId}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> createSample(@PathVariable Long appointmentId, @RequestBody SampleRequest sampleRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return sampleService.createSampleByAppointmentId(appointmentId, sampleRequest, username);
    }

    @GetMapping("/get/sample/{sampleId}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> getSampleById(@PathVariable Long sampleId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return sampleService.getSampleById(sampleId);
    }

    @GetMapping("/get/sample-appointment/{appointmentId}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> getSamplesByAppointmentId(@PathVariable Long appointmentId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return sampleService.getSampleByAppointmentId(appointmentId);
    }

    @PutMapping("/update/{sampleId}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> updateSample(@PathVariable Long sampleId,
                                          @Valid @RequestBody SampleRequest sampleRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return sampleService.updateSample(sampleId, sampleRequest, username);
    }

    /**
     * Xóa mẫu (xóa cứng)
     */
    @DeleteMapping("/{sampleId}")
    @PreAuthorize("hasAnyRole('STAFF','MANAGER')")
    public ResponseEntity<?> deleteSample(@PathVariable Long sampleId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return sampleService.deleteSample(sampleId, username);
    }


    /**
     * Xóa mềm mẫu (đổi trạng thái)
     */
//    @PatchMapping("/{sampleId}/soft-delete")
//    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
//    public ResponseEntity<?> softDeleteSample(@PathVariable Long sampleId) {
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        String username = auth.getName();
//        return sampleService.softDeleteSample(sampleId, username);
//    }
}
