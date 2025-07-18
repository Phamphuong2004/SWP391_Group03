package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.ResultCreationRequest;
import com.swp.adnV2.AdnV2.dto.ResultReponse;
import com.swp.adnV2.AdnV2.dto.ResultUpdateRequest;
import com.swp.adnV2.AdnV2.entity.Result;
import com.swp.adnV2.AdnV2.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
}
