package com.swp.adnV2.AdnV2.dto;

import com.swp.adnV2.AdnV2.entity.Appointment;

import java.time.LocalDateTime;

public class PaymentUpdateRequest {
    private double amount;

    private LocalDateTime paymentDate = LocalDateTime.now();

    private String paymentMethod;

    private String status = "Pending";

    private Long appointmentId;

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }
}
