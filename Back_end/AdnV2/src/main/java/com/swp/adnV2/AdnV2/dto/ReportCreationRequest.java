package com.swp.adnV2.AdnV2.dto;

import com.swp.adnV2.AdnV2.entity.Users;

import java.time.LocalDateTime;

public class ReportCreationRequest {

    private String reportTitle;


    private String reportContent;

    private String username;

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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
