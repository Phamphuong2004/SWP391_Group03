package com.swp.adnV2.AdnV2.dto;

public class TestCategoryRequest {
    private String testCategoryName;
    private String serviceName;
    private Boolean isActive;

    public String getTestCategoryName() {
        return testCategoryName;
    }

    public void setTestCategoryName(String testCategoryName) {
        this.testCategoryName = testCategoryName;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }
}
