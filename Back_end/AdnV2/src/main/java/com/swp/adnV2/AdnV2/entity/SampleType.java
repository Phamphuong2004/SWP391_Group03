package com.swp.adnV2.AdnV2.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name= "sample_type")
public class SampleType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") // <-- Đúng với tên cột trong DB
    private Long id;

    @Column(name = "name", columnDefinition = "NVARCHAR(255)", unique = true)
    private String name;

    @Column(name = "description", columnDefinition = "NVARCHAR(255)")
    private String description;

    @ManyToOne
    @JoinColumn(name = "kit_component_id", nullable = false)
    private KitComponent kitComponent;

    @OneToMany(mappedBy = "sampleType")
    private List<CollectedSample> collectedSamples;

    public SampleType() {
    }

    public SampleType(String name, String description, KitComponent kitComponent, List<CollectedSample> collectedSamples) {
        this.name = name;
        this.description = description;
        this.kitComponent = kitComponent;
        this.collectedSamples = collectedSamples;
    }
    public Long getId() {
        return id;
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

    public KitComponent getKitComponent() {
        return kitComponent;
    }

    public void setKitComponent(KitComponent kitComponent) {
        this.kitComponent = kitComponent;
    }

    public List<CollectedSample> getCollectedSamples() {
        return collectedSamples;
    }

    public void setCollectedSamples(List<CollectedSample> collectedSamples) {
        this.collectedSamples = collectedSamples;
    }
}
