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
    @JoinColumn(name = "participant_id")
    private Participant participant;

    @ManyToOne
    @JoinColumn(name = "appointment_service_id", nullable = false)
    private AppointmentService appointmentService;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @ManyToOne
    @JoinColumn(name = "kit_component_id", nullable = false)
    private KitComponent kitComponent;

    // Default constructor
    public Sample() {
    }

    // Getters and setters
    public Long getSampleId() {
        return sampleId;
    }

    public void setSampleId(Long sampleId) {
        this.sampleId = sampleId;
    }

    public Participant getParticipant() {
        return participant;
    }

    public void setParticipant(Participant participant) {
        this.participant = participant;
    }

    public AppointmentService getAppointmentService() {
        return appointmentService;
    }

    public void setAppointmentService(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
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
                ", participant=" + participant +
                ", appointmentService=" + appointmentService +
                ", user=" + user +
                ", kitComponent=" + kitComponent +
                ", sampleType='" + sampleType + '\'' +
                ", collectedDate=" + collectedDate +
                ", receivedDate=" + receivedDate +
                ", status='" + status + '\'' +
                '}';
    }
}
