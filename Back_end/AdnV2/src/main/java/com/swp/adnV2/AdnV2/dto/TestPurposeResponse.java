package com.swp.adnV2.AdnV2.dto;

public class TestPurposeResponse {
    private Long id;
    private String purposeName;
    private Boolean isActive;
    private String testPurposeDescription;

    public String getTestPurposeDescription() {
        return testPurposeDescription;
    }

    public void setTestPurposeDescription(String testPurposeDescription) {
        this.testPurposeDescription = testPurposeDescription;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPurposeName() {
        return purposeName;
    }

    public void setPurposeName(String purposeName) {
        this.purposeName = purposeName;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }
}
