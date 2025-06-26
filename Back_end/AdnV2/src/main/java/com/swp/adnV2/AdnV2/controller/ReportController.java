package com.swp.adnV2.AdnV2.controller;


import com.swp.adnV2.AdnV2.dto.ReportCreationRequest;
import com.swp.adnV2.AdnV2.dto.ReportUpdateRequest;
import com.swp.adnV2.AdnV2.entity.Report;
import com.swp.adnV2.AdnV2.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RequestMapping("/api/reports")
public class ReportController {
    @Autowired
    private ReportService reportService;

    @PostMapping ("/create")
    public Report createReport(ReportCreationRequest request) {
        // Logic to create a report
        return reportService.createReport(request);
    }

    @GetMapping("/getList")
    public List<Report> getAllReports() {
        // Logic to get all reports
        return reportService.getAllReports();
    }

    // Additional methods for updating and deleting reports can be added here
    @PutMapping("/{report_id}")
    public Report updateReport(Long reportId, ReportUpdateRequest request) {
        // Logic to update a report
        return reportService.updateReport(reportId, request);
    }

    @DeleteMapping("/{report_id}")
    public void deleteReport(Long reportId) {
        // Logic to delete a report
        reportService.deleteReport(reportId);
    }

    @GetMapping("/{report_id}")
    public Report getReportById(Long reportId) {
        // Logic to get a report by ID
        return reportService.getReportById(reportId);
    }

    @GetMapping("/getListByUserId/{user_id}")
    public List<Report> getReportsByUserId(Long userId) {
        // Logic to get reports by user ID
        return reportService.getReportsByUserId(userId);
    }


}
