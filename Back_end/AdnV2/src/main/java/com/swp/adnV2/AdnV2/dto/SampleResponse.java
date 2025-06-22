package com.swp.adnV2.AdnV2.dto;

import java.time.LocalDate;

public class SampleResponse {
    private Long sampleId;
    private String sampleType;
    private LocalDate collectedDate;
    private LocalDate receivedDate;
    private String status;
    private String participantFullName;
    private String username;
    private String kitComponentName;

    public Long getSampleId() {
        return sampleId;
    }

    public void setSampleId(Long sampleId) {
        this.sampleId = sampleId;
    }

    public String getSampleType() {
        return sampleType;
    }

    public void setSampleType(String sampleType) {
        this.sampleType = sampleType;
    }

    public LocalDate getCollectedDate() {
        return collectedDate;
    }

    public void setCollectedDate(LocalDate collectedDate) {
        this.collectedDate = collectedDate;
    }

    public LocalDate getReceivedDate() {
        return receivedDate;
    }

    public void setReceivedDate(LocalDate receivedDate) {
        this.receivedDate = receivedDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getParticipantFullName() {
        return participantFullName;
    }

    public void setParticipantFullName(String participantFullName) {
        this.participantFullName = participantFullName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getKitComponentName() {
        return kitComponentName;
    }

    public void setKitComponentName(String kitComponentName) {
        this.kitComponentName = kitComponentName;
    }
}
