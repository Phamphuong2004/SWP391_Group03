package com.swp.adnV2.AdnV2.controller;


import com.swp.adnV2.AdnV2.dto.ReportCreationRequest;
import com.swp.adnV2.AdnV2.dto.ReportReponse;
import com.swp.adnV2.AdnV2.dto.ReportUpdateRequest;
import com.swp.adnV2.AdnV2.entity.Report;
import com.swp.adnV2.AdnV2.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    @Autowired
    private ReportService reportService;

    @PostMapping ("/create")
    public ReportReponse createReport(@RequestBody ReportCreationRequest request) {
        // Logic to create a report
        return reportService.createReport(request);
    }

    @GetMapping("/getList")
    public List<ReportReponse> getAllReports() {
        // Logic to get all reports
        return reportService.getAllReports();
    }

    // Additional methods for updating and deleting reports can be added here
    @PutMapping("/{report_id}")
    public ReportReponse updateReport(@PathVariable("report_id") Long reportId, @RequestBody ReportUpdateRequest request) {
        // Logic to update a report
        return reportService.updateReport(reportId, request);
    }

    @DeleteMapping("/{report_id}")
    public String deleteReport(@PathVariable("report_id") Long reportId) {
        // Logic to delete a report
        reportService.deleteReport(reportId);
        return "Report has been deleted successfully";
    }

    @GetMapping("/{report_id}")
    public ReportReponse getReportById(@PathVariable("report_id") Long reportId) {
        // Logic to get a report by ID
        return reportService.getReportById(reportId);
    }

    @GetMapping("/getListByUserName/{user_name}")
    public List<ReportReponse> getReportsByUsername(@RequestParam("user_name") String username) {
        // Logic to get reports by user ID
        return reportService.getReportsByUsername(username);
    }


}
