package com.swp.adnV2.AdnV2.dto;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public class AppointmentResponse {
    private Long appointmentId;
    private String fullName;
    private LocalDate dob;
    private String phone;
    private String email;
    private String gender;
    private String testPurpose;
    private String testCategory;
    private String serviceType;
    private LocalDateTime appointmentDate;
    private LocalDateTime collectionSampleTime;
    private String fingerprintFile;
    private String district;
    private String province;
    private String status;
    private String resultFile;
    private Long userId;
    private String kitComponentName;
    private List<String> samples;
//    private Long userId;
//    private String username;  // Optional: include if you want to show which user the appointment belongs to


    public List<String> getSamples() {
        return samples;
    }

    public void setSamples(List<String> samples) {
        this.samples = samples;
    }

    public String getKitComponentName() {
        return kitComponentName;
    }

    public void setKitComponentName(String kitComponentName) {
        this.kitComponentName = kitComponentName;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTestCategory() {
        return testCategory;
    }

    public void setTestCategory(String testCategory) {
        this.testCategory = testCategory;
    }

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
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

    public LocalDateTime getCollectionSampleTime() {
        return collectionSampleTime;
    }

    public void setCollectionSampleTime(LocalDateTime collectionSampleTime) {
        this.collectionSampleTime = collectionSampleTime;
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

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }
}
