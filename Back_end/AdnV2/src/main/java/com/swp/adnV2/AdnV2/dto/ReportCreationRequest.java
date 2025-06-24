package com.swp.adnV2.AdnV2.dto;

import com.swp.adnV2.AdnV2.entity.Users;

import java.time.LocalDateTime;

public class ReportCreationRequest {

    private String reportTitle;


    private String reportContent;


    private LocalDateTime createdAt = LocalDateTime.now();


    private Users users;

    public String getReportTitle() {
        return reportTitle;
    }

    public void setReportTitle(String reportTitle) {
        this.reportTitle = reportTitle;
    }

    public String getReportContent() {
        return reportContent;
    }

    public void setReportContent(String reportContent) {
        this.reportContent = reportContent;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }
}
