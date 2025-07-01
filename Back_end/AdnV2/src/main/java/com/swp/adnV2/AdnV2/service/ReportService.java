package com.swp.adnV2.AdnV2.service;


import com.swp.adnV2.AdnV2.dto.ReportCreationRequest;
import com.swp.adnV2.AdnV2.dto.ReportReponse;
import com.swp.adnV2.AdnV2.dto.ReportUpdateRequest;
import com.swp.adnV2.AdnV2.entity.Report;
import com.swp.adnV2.AdnV2.entity.Users;
import com.swp.adnV2.AdnV2.repository.ReportRepository;
import com.swp.adnV2.AdnV2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {
    @Autowired
    public ReportRepository reportRepository;
    @Autowired
    public UserRepository userRepository;

    // Add methods to handle report creation, retrieval, updating, and deletion
    public ReportReponse createReport(ReportCreationRequest request) {
        // Implementation for creating a report
        Report report = new Report();
        report.setReportTitle(request.getReportTitle());
        report.setReportContent(request.getReportContent());
        Users user = userRepository.findByUsername(request.getUsername());
        if (user == null) {
            throw new RuntimeException("User not found with username: " + request.getUsername());
        }
        //if (reportRepository.existsByReportTitleAndUsers_UserId(request.getReportTitle(), user.getUserId())) {
        //    throw new RuntimeException("Report with title '" + request.getReportTitle() + "' already exists for user: " + user.getUsername());
        //}
        if( report.getReportTitle() == null || report.getReportTitle().isEmpty()) {
            throw new RuntimeException("Report title cannot be null or empty");
        }
        if( report.getReportContent() == null || report.getReportContent().isEmpty()) {
            throw new RuntimeException("Report content cannot be null or empty");
        }

        report.setUsers(user);
        reportRepository.save(report);
        ReportReponse response = new ReportReponse();
        response.setReportId(report.getReportId());
        response.setReportTitle(report.getReportTitle());
        response.setReportContent(report.getReportContent());
        response.setCreatedAt(report.getCreatedAt());
        response.setUsername(user.getUsername());
        return response;
    }

    public ReportReponse updateReport(Long reportId, ReportUpdateRequest request) {
        // Implementation for updating a report
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + reportId));

        report.setReportTitle(request.getReportTitle());
        report.setReportContent(request.getReportContent());
        Users user = userRepository.findByUsername(request.getUsername());
        if (user == null) {
            throw new RuntimeException("User not found with username: " + request.getUsername());
        }
        //if (reportRepository.existsByReportTitleAndUsers_UserId(request.getReportTitle(), user.getUserId())) {
        //    throw new RuntimeException("Report with title '" + request.getReportTitle() + "' already exists for user: " + user.getUsername());
        //}
        if( report.getReportTitle() == null || report.getReportTitle().isEmpty()) {
            throw new RuntimeException("Report title cannot be null or empty");
        }
        if( report.getReportContent() == null || report.getReportContent().isEmpty()) {
            throw new RuntimeException("Report content cannot be null or empty");
        }
        report.setUsers(user);
        reportRepository.save(report);
        ReportReponse response = new ReportReponse();
        response.setReportId(report.getReportId());
        response.setReportTitle(report.getReportTitle());
        response.setReportContent(report.getReportContent());
        response.setCreatedAt(report.getCreatedAt());
        response.setUsername(user.getUsername());
        return response;
    }

    public void deleteReport(Long reportId) {
        // Implementation for deleting a report
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + reportId));
        reportRepository.deleteById(reportId);
    }

    public ReportReponse getReportById(Long reportId) {
        // Implementation for retrieving a report by ID
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + reportId));
        ReportReponse response = new ReportReponse();
        response.setReportId(report.getReportId());
        response.setReportTitle(report.getReportTitle());
        response.setReportContent(report.getReportContent());
        response.setCreatedAt(report.getCreatedAt());
        response.setUsername(report.getUsers().getUsername());
        return response;
    }

    public List<ReportReponse> getAllReports() {
        List<Report> reports = reportRepository.findAll();
        if (reports.isEmpty()) {
            throw new RuntimeException("No reports found");
        }
        return reports.stream().map(report -> {
            ReportReponse response = new ReportReponse();
            response.setReportId(report.getReportId());
            response.setReportTitle(report.getReportTitle());
            response.setReportContent(report.getReportContent());
            response.setCreatedAt(report.getCreatedAt());
            response.setUsername(report.getUsers().getUsername());
            return response;
        }).toList();
    }

    public List<ReportReponse> getReportsByUsername(String username) {
        // Implementation for retrieving reports by user ID
        Users user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found with username: " + username);
        }
        List<Report> reports = reportRepository.findByUsers_UserId(user.getUserId());
        if (reports.isEmpty()) {
            throw new RuntimeException("No reports found for user with username: " + username);
        }
        return reports.stream().map(report -> {
            ReportReponse response = new ReportReponse();
            response.setReportId(report.getReportId());
            response.setReportTitle(report.getReportTitle());
            response.setReportContent(report.getReportContent());
            response.setCreatedAt(report.getCreatedAt());
            response.setUsername(user.getUsername());
            return response;
        }).toList();
    }
}