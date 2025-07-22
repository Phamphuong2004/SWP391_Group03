package com.swp.adnV2.AdnV2.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "service_test_purpose")
public class ServiceTestPurpose {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private Services service;

    @ManyToOne
    @JoinColumn(name = "test_purpose_id", nullable = false)
    private TestPurpose testPurpose;

    @Column(name = "is_active")
    private Boolean isActive = true;

    public Services getService() {
        return service;
    }

    public void setService(Services service) {
        this.service = service;
    }

    public TestPurpose getTestPurpose() {
        return testPurpose;
    }

    public void setTestPurpose(TestPurpose testPurpose) {
        this.testPurpose = testPurpose;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public Long getId() {
        return id;
    }
}