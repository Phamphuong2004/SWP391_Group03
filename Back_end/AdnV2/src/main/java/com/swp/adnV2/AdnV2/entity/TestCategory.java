package com.swp.adnV2.AdnV2.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "TestCategory")
public class TestCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "test_category_id")
    private Long id;

    @Column(name = "name", columnDefinition = "NVARCHAR(255)", unique = true, nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Services service;

    @Column(name = "is_active")
    private Boolean isActive;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TestCategory() {
        this.isActive = true;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Services getService() {
        return service;
    }

    public void setService(Services service) {
        this.service = service;
    }
}