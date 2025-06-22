package com.swp.adnV2.AdnV2.dto;

import com.swp.adnV2.AdnV2.entity.Sample;
import com.swp.adnV2.AdnV2.entity.Users;

import java.time.LocalDate;

public class ResultUpdateRequest {
    private LocalDate resultDate;
    private String resultData;
    private String interpretation;
    private String status = "Pending";
    private Sample sample;
    private Users users;

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

    public Sample getSample() {
        return sample;
    }

    public void setSample(Sample sample) {
        this.sample = sample;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }
}
