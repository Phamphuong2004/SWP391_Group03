package com.swp.adnV2.AdnV2.dto;

public class KitComponentResponse {
    private String serviceName;
    private Long kitComponentId;
    private String kitComponentName;
    private String introduction;
    private int quantity;

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public Long getKitComponentId() {
        return kitComponentId;
    }

    public void setKitComponentId(Long kitComponentId) {
        this.kitComponentId = kitComponentId;
    }

    public String getKitComponentName() {
        return kitComponentName;
    }

    public void setKitComponentName(String kitComponentName) {
        this.kitComponentName = kitComponentName;
    }

    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}