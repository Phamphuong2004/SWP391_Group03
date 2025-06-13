package com.swp.adnV2.AdnV2.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "Participant")
public class Participant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "participant_id")
    private Long participantId;

    @Column(name = "full_name", nullable = false, columnDefinition = "NVARCHAR(100)")
    private String fullName;

    @Column(name = "gender", columnDefinition = "NVARCHAR(10)")
    private String gender;

    @Column(name = "relationship_to_customer", columnDefinition = "NVARCHAR(50)")
    private String relationshipToCustomer;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "appointment_service_id")
    private AppointmentService appointmentService;

    // Default constructor
    public Participant() {
    }

    // Getters and setters
    public Long getParticipantId() {
        return participantId;
    }

    public void setParticipantId(Long participantId) {
        this.participantId = participantId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getRelationshipToCustomer() {
        return relationshipToCustomer;
    }

    public void setRelationshipToCustomer(String relationshipToCustomer) {
        this.relationshipToCustomer = relationshipToCustomer;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public AppointmentService getAppointmentService() {
        return appointmentService;
    }

    public void setAppointmentService(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @Override
    public String toString() {
        return "Participant{" +
                "participantId=" + participantId +
                ", user=" + user +
                ", fullName='" + fullName + '\'' +
                ", gender='" + gender + '\'' +
                ", relationshipToCustomer='" + relationshipToCustomer + '\'' +
                ", dateOfBirth=" + dateOfBirth +
                ", appointmentService=" + appointmentService +
                '}';
    }
}
