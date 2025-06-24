package com.swp.adnV2.AdnV2.service;


import com.swp.adnV2.AdnV2.dto.ReportCreationRequest;
import com.swp.adnV2.AdnV2.dto.ReportUpdateRequest;
import com.swp.adnV2.AdnV2.entity.Report;
import com.swp.adnV2.AdnV2.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {
    @Autowired
    public ReportRepository reportRepository;

    // Add methods to handle report creation, retrieval, updating, and deletion
    public Report createReport(ReportCreationRequest request) {
        // Implementation for creating a report
        Report report = new Report();
        report.setReportTitle(request.getReportTitle());
        report.setReportContent(request.getReportContent());
        report.setCreatedAt(request.getCreatedAt());
        report .setUser(request.getUsers());
        return reportRepository.save(report);
    }

    public Report updateReport(Long reportId, ReportUpdateRequest request) {
        // Implementation for updating a report
        Report report = getReportById(reportId);

        report.setReportTitle(request.getReportTitle());
        report.setReportContent(request.getReportContent());
        report.setCreatedAt(request.getCreatedAt());
        report.setUser(request.getUsers());

        return reportRepository.save(report);
    }

    public void deleteReport(Long reportId) {
        // Implementation for deleting a report
        reportRepository.deleteById(reportId);
    }

    public Report getReportById(Long reportId) {
        return reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + reportId));
    }
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public List<Report> getReportsByUserId(Long userId) {
        return reportRepository.findByUsers_UserId(userId);
    }

}
