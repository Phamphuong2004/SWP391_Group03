package com.swp.adnV2.AdnV2.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "collected_sample")
public class CollectedSample {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "collected_sample_id")
    private Long sampleId;


    @Column(name = "collected_date")
    private LocalDate collectedDate;

    @Column(name = "received_date")
    private LocalDate receivedDate;

    @Column(name = "status", columnDefinition = "NVARCHAR(20) DEFAULT 'In Transit'")
    private String status = "In Transit";

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private Users users;

    @ManyToOne
    @JoinColumn(name = "kit_component_id", nullable = true)
    private KitComponent kitComponent;

    @ManyToOne
    @JoinColumn(name = "appointment_id", nullable = true)
    private Appointment appointment;

    // Thêm mối quan hệ N-1 với Participant
    @ManyToOne
    @JoinColumn(name = "participant_id", nullable = true)
    private Participant participant;

    @ManyToOne
    @JoinColumn(name = "sample_type_id", nullable = false)
    private SampleType sampleType;

    // Default constructor
    public CollectedSample() {
    }

    // Getters and setters


    public Participant getParticipant() {
        return participant;
    }

    public void setParticipant(Participant participant) {
        this.participant = participant;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    public Long getSampleId() { return sampleId; }
    public void setSampleId(Long id) { this.sampleId = id; }


    public Users getUsers() { return users; }
    public void setUsers(Users users) { this.users = users; }

    public KitComponent getKitComponent() {
        return kitComponent;
    }

    public void setKitComponent(KitComponent kitComponent) {
        this.kitComponent = kitComponent;
    }

    public SampleType getSampleType() {
        return sampleType;
    }

    public void setSampleType(SampleType sampleType) {
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
