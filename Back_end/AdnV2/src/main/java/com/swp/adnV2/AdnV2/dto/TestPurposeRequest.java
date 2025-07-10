package com.swp.adnV2.AdnV2.dto;

public class TestPurposeRequest {
    private String testPurposeName;
    private String testPurposeDescription;
    private Boolean isActive;


    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public String getTestPurposeName() {
        return testPurposeName;
    }

    public void setTestPurposeName(String testPurposeName) {
        this.testPurposeName = testPurposeName;
    }

    public String getTestPurposeDescription() {
        return testPurposeDescription;
    }

    public void setTestPurposeDescription(String testPurposeDescription) {
        this.testPurposeDescription = testPurposeDescription;
    }
}
