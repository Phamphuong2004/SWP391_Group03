package com.swp.adnV2.AdnV2.dto;

import com.swp.adnV2.AdnV2.entity.CollectedSample;
import com.swp.adnV2.AdnV2.entity.KitComponent;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

import java.util.List;

public class SampleTypeCreateRequest {
    private String name;

    private String description;

    private String componentName;

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
}
