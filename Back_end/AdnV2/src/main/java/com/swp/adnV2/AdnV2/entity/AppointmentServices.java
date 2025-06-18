package com.swp.adnV2.AdnV2.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "AppointmentService")
public class AppointmentServices {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointment_service_id")
    private Long appointmentServiceId;

    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Services service;

    // Default constructor
    public AppointmentServices() {
    }

    // Parameterized constructor
    public AppointmentServices(Appointment appointment, Services service) {
        this.appointment = appointment;
        this.service = service;
    }

    // Getters and setters
    public Long getAppointmentServiceId() {
        return appointmentServiceId;
    }

    public void setAppointmentServiceId(Long appointmentServiceId) {
        this.appointmentServiceId = appointmentServiceId;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    public Services getService() {
        return service;
    }

    public void setService(Services service) {
        this.service = service;
    }

    @Override
    public String toString() {
        return "AppointmentService{" +
                "appointmentServiceId=" + appointmentServiceId +
                ", appointment=" + appointment +
                ", service=" + service +
                '}';
    }
}
