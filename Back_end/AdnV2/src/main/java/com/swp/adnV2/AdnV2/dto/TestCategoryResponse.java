package com.swp.adnV2.AdnV2.dto;

public class TestCategoryResponse {
    private Long id;
    private String testCategoryName;
    private String serviceName;
    private Boolean isActive;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
