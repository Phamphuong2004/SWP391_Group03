package com.swp.adnV2.AdnV2.dto;

public class ServiceTestPurposeRequest {
    private String serviceName;
    private String testPurposeName;

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getTestPurposeName() {
        return testPurposeName;
    }

    public void setTestPurposeName(String testPurposeName) {
        this.testPurposeName = testPurposeName;
    }
}
