package com.swp.adnV2.AdnV2.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "Services")
public class Services {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    private Long serviceId;

    @Column(name = "service_name", columnDefinition = "NVARCHAR(100)", nullable = false, unique = true)
    private String serviceName;

    @Column(name = "description", columnDefinition = "NVARCHAR(255)")
    private String description;

    @Column(name = "price", nullable = false)
    private double price;

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<TestCategory> testCategories;

    @OneToMany(mappedBy = "service")
    private List<ServiceTestPurpose> serviceTestPurposes;

    public Services() {
    }

    public Services(String serviceName, String description, double price) {
        this.serviceName = serviceName;
        this.description = description;
        this.price = price;
    }

    public List<TestCategory> getTestCategories() {
        return testCategories;
    }

    public void setTestCategories(List<TestCategory> testCategories) {
        this.testCategories = testCategories;
    }

    public List<ServiceTestPurpose> getServiceTestPurposes() {
        return serviceTestPurposes;
    }

    public void setServiceTestPurposes(List<ServiceTestPurpose> serviceTestPurposes) {
        this.serviceTestPurposes = serviceTestPurposes;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }
}
