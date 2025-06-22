package com.swp.adnV2.AdnV2.dto;

public class AppointmentUpdateRequest {
    private String status;
    private String resultFile;
    private String kit_component_name;

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

    public String getKit_component_name() {
        return kit_component_name;
    }

    public void setKit_component_name(String kit_component_name) {
        this.kit_component_name = kit_component_name;
    }
}
