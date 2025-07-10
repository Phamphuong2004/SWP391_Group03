package com.swp.adnV2.AdnV2.dto;

public class ServiceTestPurposeResponse {
    private Long id;
    private String serviceName;
    private String testPurposeName;
    private Boolean isActive;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getServiceName() {
        return serviceName;
    }

    public String getTestPurposeName() {
        return testPurposeName;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public void setTestPurposeName(String testPurposeName) {
        this.testPurposeName = testPurposeName;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }
}
