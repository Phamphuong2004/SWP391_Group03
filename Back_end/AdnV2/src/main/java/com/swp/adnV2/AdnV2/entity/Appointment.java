package com.swp.adnV2.AdnV2.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "Appointment")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointment_id")
    private Long appointmentId;


    @ManyToOne(optional = true)
    @JoinColumn(name = "user_id", nullable = true)
    @JsonIgnore
    private Users users;

    // Thêm phương thức này để vẫn hiển thị userId
    @JsonProperty("userId")
    public Long getUserId() {
        return users != null ? users.getUserId() : null;
    }

    @Column(name = "full_name", columnDefinition = "NVARCHAR(100)", nullable = false)
    private String fullName;

    @Column(name = "dob", nullable = false)
    private LocalDate dob;

    @Column(name = "phone", columnDefinition = "NVARCHAR(20)", nullable = false)
    private String phone;

    @Column(name = "email", columnDefinition = "NVARCHAR(100)")
    private String email;

    @Column(name = "gender", columnDefinition = "NVARCHAR(10)")
    private String gender;

    @Column(name = "appointment_date", nullable = false)
    private LocalDateTime appointmentDate;

    @Column(name = "collection_sample_time")
    private LocalDateTime collectionSampleTime;

    @Column(name = "status", columnDefinition = "NVARCHAR(20) DEFAULT 'Pending'")
    private String status = "Pending";

    @Column(name = "note", columnDefinition = "NVARCHAR(MAX)")
    private String note;

    @Column(name = "test_purpose", columnDefinition = "NVARCHAR(50)", nullable = false)
    private String testPurpose = "Dân sự";

    @Column(name = "service_type", columnDefinition = "NVARCHAR(50)")
    private String serviceType;

    @Column(name = "test_category", columnDefinition = "NVARCHAR(50)")
    private String testCategory;

    @Column(name = "fingerprint_file", columnDefinition = "NVARCHAR(255)")
    private String fingerprintFile;

    @Column(name = "result_file", columnDefinition = "NVARCHAR(255)")
    private String resultFile;

    @Column(name = "district", columnDefinition = "NVARCHAR(100)")
    private String district;

    @Column(name = "province", columnDefinition = "NVARCHAR(100)")
    private String province;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Services service;

    // Default constructor
    public Appointment() {}

    public Services getService() {
        return service;
    }

    public void setService(Services service) {
        this.service = service;
    }

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public Users getUser() {
        return users;
    }

    public void setUser(Users users) {
        this.users = users;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public LocalDateTime getCollectionSampleTime() {
        return collectionSampleTime;
    }

    public void setCollectionSampleTime(LocalDateTime collectionSampleTime) {
        this.collectionSampleTime = collectionSampleTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getTestPurpose() {
        return testPurpose;
    }

    public void setTestPurpose(String testPurpose) {
        this.testPurpose = testPurpose;
    }

    public String getServiceType() {
        return serviceType;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public String getTestCategory() {
        return testCategory;
    }

    public void setTestCategory(String testCategory) {
        this.testCategory = testCategory;
    }

    public String getFingerprintFile() {
        return fingerprintFile;
    }

    public void setFingerprintFile(String fingerprintFile) {
        this.fingerprintFile = fingerprintFile;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public String getResultFile() {
        return resultFile;
    }

    public void setResultFile(String resultFile) {
        this.resultFile = resultFile;
    }

}
