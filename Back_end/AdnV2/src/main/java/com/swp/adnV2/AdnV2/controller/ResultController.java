package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.ResultCreationRequest;
import com.swp.adnV2.AdnV2.dto.ResultReponse;
import com.swp.adnV2.AdnV2.dto.ResultUpdateRequest;
import com.swp.adnV2.AdnV2.entity.Result;
import com.swp.adnV2.AdnV2.service.ResultService;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
@RestController
@RequestMapping("/api/results")
public class ResultController {
@Autowired
    private ResultService resultService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    ResultReponse createRequest(@RequestBody ResultCreationRequest request) {
        return resultService.createResult(request);
    }

    @GetMapping("/getList")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public List<ResultReponse> getAllResults() {
        return resultService.getAllResults();
    }

    @GetMapping("/{result_id}")
    @PreAuthorize("permitAll()")
    public ResultReponse getResultById(@PathVariable("result_id") Long resultId) {
        return resultService.getResultById(resultId);
    }

    @PutMapping("/{result_id}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResultReponse updateResult(@PathVariable Long result_id, @RequestBody ResultUpdateRequest request) {
        return resultService.updateResult(result_id, request);
    }

    @DeleteMapping("/{result_id}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public String deleteResult(@PathVariable Long result_id) {
        resultService.deleteResult(result_id);
        return "Result has been deleted successfully";
    }

    // Cho phép guest tra cứu kết quả theo mã lịch hẹn
    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("permitAll()")
    public ResultReponse getResultByAppointmentId(@PathVariable Long appointmentId) {
        return resultService.getResultByAppointmentId(appointmentId);
    }

    @GetMapping("/download/{fileName:.+}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Resource> downloadResultFile(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get("uploads").resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<String> uploadResultFile(
            @RequestParam("file") MultipartFile file) {
        try {
            String uploadDir = "uploads";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(file.getOriginalFilename());
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return ResponseEntity.ok(file.getOriginalFilename());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed: " + e.getMessage());
        }
    }
}
