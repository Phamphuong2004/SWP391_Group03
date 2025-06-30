package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.PaymentCreationRequest;
import com.swp.adnV2.AdnV2.dto.PaymentUpdateRequest;
import com.swp.adnV2.AdnV2.entity.Payment;
import com.swp.adnV2.AdnV2.repository.AppointmentRepository;
import com.swp.adnV2.AdnV2.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {
    @Autowired
    public PaymentRepository paymentRepository;
    public AppointmentRepository appointmentRepository;

    // Add methods to handle payment creation, retrieval, updating, and deletion
    public Payment createPayment(PaymentCreationRequest payment) {
        // Implementation for creating a payment
        Payment newPayment = new Payment();
        newPayment.setAmount(payment.getAmount());
        newPayment.setPaymentDate(payment.getPaymentDate());
        newPayment.setPaymentMethod(payment.getPaymentMethod());
        newPayment.setStatus(payment.getStatus());
        newPayment.setAppointment(appointmentRepository.findById(payment.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + payment.getAppointmentId())));
        // Assuming Appointment is already set in the PaymentCreationRequest
        return paymentRepository.save(newPayment);
    }
    public Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));
    }
    public void deletePayment(Long paymentId) {
        // Implementation for deleting a payment
        paymentRepository.deleteById(paymentId);
    }
    public Payment updatePayment(Long paymentId, PaymentUpdateRequest payment) {
        // Implementation for updating a payment
        Payment existingPayment = getPaymentById(paymentId);
        existingPayment.setAmount(payment.getAmount());
        existingPayment.setPaymentDate(payment.getPaymentDate());
        existingPayment.setPaymentMethod(payment.getPaymentMethod());
        existingPayment.setStatus(payment.getStatus());
        existingPayment.setAppointment(appointmentRepository.findById(payment.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + payment.getAppointmentId())));
        return paymentRepository.save(existingPayment);
    }
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
    public Payment getPaymentsByAppointmentId(Long appointmentId) {
        return paymentRepository.findByAppointment_AppointmentId(appointmentId);
    }


}
