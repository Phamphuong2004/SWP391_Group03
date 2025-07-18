package com.swp.adnV2.AdnV2.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "TestPurpose")
public class TestPurpose {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "test_purpose_id")
    private Long id;

    @Column(name = "test_purpose_name", columnDefinition = "NVARCHAR(255)", unique = true, nullable = false)
    private String testPurposeName;

    @OneToMany(mappedBy = "testPurpose")
    private List<ServiceTestPurpose> serviceTestPurposes;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "test_purpose_description", columnDefinition = "NVARCHAR(255)")
    private String testPurposeDescription;

    public String getTestPurposeDescription() {
        return testPurposeDescription;
    }

    public void setTestPurposeDescription(String testPurposeDescription) {
        this.testPurposeDescription = testPurposeDescription;
    }

    public TestPurpose() {
        this.isActive = true;
    }

    public Long getId() {
        return id;
    }


    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }

    public String getTestPurposeName() {
        return testPurposeName;
    }

    public void setTestPurposeName(String testPurposeName) {
        this.testPurposeName = testPurposeName;
    }
    public List<ServiceTestPurpose> getServiceTestPurposes() {
        return serviceTestPurposes;
    }

    public void setServiceTestPurposes(List<ServiceTestPurpose> serviceTestPurposes) {
        this.serviceTestPurposes = serviceTestPurposes;
    }
}
