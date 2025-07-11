package com.swp.adnV2.AdnV2.dto;

import java.util.List;

public class SampleTypeResponse {
    private Long id;

    private String name;

    private String description;

    private String componentName;

    private List<Long> sampleId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getComponentName() {
        return componentName;
    }

    public void setComponentName(String componentName) {
        this.componentName = componentName;
    }

    public List<Long> getSampleId() {
        return sampleId;
    }

    public void setSampleId(List<Long> sampleId) {
        this.sampleId = sampleId;
    }
}
