package com.swp.adnV2.AdnV2.dto;

public class AppointmentUpdateRequest {
    private String status;
    private String resultFile;
    private String kitComponentName;
    private String sampleType;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResultFile() {
        return resultFile;
    }

    public void setResultFile(String resultFile) {
        this.resultFile = resultFile;
    }

    public String getKitComponentName() {
        return kitComponentName;
    }

    public void setKitComponentName(String kitComponentName) {
        this.kitComponentName = kitComponentName;
    }

    public String getSampleType() {
        return sampleType;
    }

    public void setSampleType(String sampleType) {
        this.sampleType = sampleType;
    }
}
