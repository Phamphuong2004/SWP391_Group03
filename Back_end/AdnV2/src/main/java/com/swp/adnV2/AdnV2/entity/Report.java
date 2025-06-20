package com.swp.adnV2.AdnV2.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name= "Report")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    @Column(name = "report_title", columnDefinition = "NVARCHAR(200)")
    private String reportTitle;

    @Column(name = "report_content", columnDefinition = "NVARCHAR(MAX)")
    private String reportContent;

    @Column(name = "created_at", columnDefinition = "DATETIME DEFAULT GETDATE()")
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users users;

    // Default constructor
    public Report() {
    }

    // Getters and setters
    public Long getReportId() {
        return reportId;
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

    public Users getUser() {
        return users;
    }

    public void setUser(Users users) {
        this.users = users;
    }

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

    @Override
    public String toString() {
        return "Report{" +
                "reportId=" + reportId +
                ", user=" + users +
                ", reportTitle='" + reportTitle + '\'' +
                ", reportContent='" + reportContent + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
