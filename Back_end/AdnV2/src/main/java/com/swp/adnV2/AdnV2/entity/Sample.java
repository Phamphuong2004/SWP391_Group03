package com.swp.adnV2.AdnV2.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "Sample")
public class Sample {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sample_id")
    private Long sampleId;

    @Column(name = "sample_type", columnDefinition = "NVARCHAR(50)")
    private String sampleType;

    @Column(name = "collected_date")
    private LocalDate collectedDate;

    @Column(name = "received_date")
    private LocalDate receivedDate;

    @Column(name = "status", columnDefinition = "NVARCHAR(20) DEFAULT 'In Transit'")
    private String status = "In Transit";

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users users;

    @ManyToOne
    @JoinColumn(name = "kit_component_id", nullable = false)
    private KitComponent kitComponent;

    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    // Default constructor
    public Sample() {
    }

    // Getters and setters


    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    public Long getSampleId() {
        return sampleId;
    }

    public void setSampleId(Long sampleId) {
        this.sampleId = sampleId;
    }


    public Users getUser() {
        return users;
    }

    public void setUser(Users users) {
        this.users = users;
    }

    public KitComponent getKitComponent() {
        return kitComponent;
    }

    public void setKitComponent(KitComponent kitComponent) {
        this.kitComponent = kitComponent;
    }

    public String getSampleType() {
        return sampleType;
    }

    public void setSampleType(String sampleType) {
        this.sampleType = sampleType;
    }

    public LocalDate getCollectedDate() {
        return collectedDate;
    }

    public void setCollectedDate(LocalDate collectedDate) {
        this.collectedDate = collectedDate;
    }

    public LocalDate getReceivedDate() {
        return receivedDate;
    }

    public void setReceivedDate(LocalDate receivedDate) {
        this.receivedDate = receivedDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Sample{" +
                "sampleId=" + sampleId +
                ", user=" + users +
                ", kitComponent=" + kitComponent +
                ", sampleType='" + sampleType + '\'' +
                ", collectedDate=" + collectedDate +
                ", receivedDate=" + receivedDate +
                ", status='" + status + '\'' +
                '}';
    }
}
