package com.swp.adnV2.AdnV2.dto;

import com.swp.adnV2.AdnV2.entity.Sample;
import com.swp.adnV2.AdnV2.entity.Users;

import java.time.LocalDate;

public class ResultCreationRequest {
    private LocalDate resultDate;
    private String resultData;
    private String interpretation;
    private String status = "Pending";
    private Long sampleId;
    private String username;
    private String resultFile;

    public String getResultFile() {
        return resultFile;
    }

    public void setResultFile(String resultFile) {
        this.resultFile = resultFile;
    }

    public LocalDate getResultDate() {
        return resultDate;
    }

    public void setResultDate(LocalDate resultDate) {
        this.resultDate = resultDate;
    }

    public String getResultData() {
        return resultData;
    }

    public void setResultData(String resultData) {
        this.resultData = resultData;
    }

    public String getInterpretation() {
        return interpretation;
    }

    public void setInterpretation(String interpretation) {
        this.interpretation = interpretation;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getSampleId() {
        return sampleId;
    }

    public void setSampleId(Long sampleId) {
        this.sampleId = sampleId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
