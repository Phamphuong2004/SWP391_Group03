package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.PaymentCreationRequest;
import com.swp.adnV2.AdnV2.dto.PaymentReponse;
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
    @Autowired
    public AppointmentRepository appointmentRepository;

    // Add methods to handle payment creation, retrieval, updating, and deletion
    public PaymentReponse createPayment(PaymentCreationRequest payment) {
        // Check if a payment already exists for the appointment
        Payment existingPayment = paymentRepository.findByAppointment_AppointmentId(payment.getAppointmentId());
        if (existingPayment != null) {
            throw new RuntimeException("Payment already exists for appointment id: " + payment.getAppointmentId());
        }
        // Implementation for creating a payment
        Payment newPayment = new Payment();
        newPayment.setAmount(payment.getAmount());
        newPayment.setPaymentDate(payment.getPaymentDate());
        newPayment.setPaymentMethod(payment.getPaymentMethod());
        newPayment.setStatus(payment.getStatus());
        newPayment.setAppointment(appointmentRepository.findById(payment.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + payment.getAppointmentId())));
        // Assuming Appointment is already set in the PaymentCreationRequest
        paymentRepository.save(newPayment);
        PaymentReponse response = new PaymentReponse();
        response.setPaymentId(newPayment.getPaymentId());
        response.setAmount(newPayment.getAmount());
        response.setPaymentDate(newPayment.getPaymentDate());
        response.setPaymentMethod(newPayment.getPaymentMethod());
        response.setStatus(newPayment.getStatus());
        response.setAppointmentId(newPayment.getAppointment().getAppointmentId());
        return response;
    }
    public PaymentReponse getPaymentById(Long paymentId) {
        // Implementation for retrieving a payment by ID
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));
        PaymentReponse response = new PaymentReponse();
        response.setPaymentId(payment.getPaymentId());
        response.setAmount(payment.getAmount());
        response.setPaymentDate(payment.getPaymentDate());
        response.setPaymentMethod(payment.getPaymentMethod());
        response.setStatus(payment.getStatus());
        response.setAppointmentId(payment.getAppointment().getAppointmentId());
        return response;
    }
    public void deletePayment(Long paymentId) {
        // Implementation for deleting a payment
        if (!paymentRepository.existsById(paymentId)) {
            throw new RuntimeException("Payment not found with id: " + paymentId);
        }
        paymentRepository.deleteById(paymentId);
    }
    public PaymentReponse updatePayment(Long paymentId, PaymentUpdateRequest payment) {
        // Implementation for updating a payment
        Payment existingPayment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));
        existingPayment.setAmount(payment.getAmount());
        existingPayment.setPaymentDate(payment.getPaymentDate());
        existingPayment.setPaymentMethod(payment.getPaymentMethod());
        existingPayment.setStatus(payment.getStatus());
        existingPayment.setAppointment(appointmentRepository.findById(payment.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + payment.getAppointmentId())));
        paymentRepository.save(existingPayment);
        PaymentReponse response = new PaymentReponse();
        response.setPaymentId(existingPayment.getPaymentId());
        response.setAmount(existingPayment.getAmount());
        response.setPaymentDate(existingPayment.getPaymentDate());
        response.setPaymentMethod(existingPayment.getPaymentMethod());
        response.setStatus(existingPayment.getStatus());
        response.setAppointmentId(existingPayment.getAppointment().getAppointmentId());
        return response;
    }
    public List<PaymentReponse> getAllPayments() {
        // Implementation for retrieving all payments
        List<Payment> payments = paymentRepository.findAll();
        if (payments.isEmpty()) {
            throw new RuntimeException("No payments found");
        }
        return payments.stream().map(payment -> {
            PaymentReponse response = new PaymentReponse();
            response.setPaymentId(payment.getPaymentId());
            response.setAmount(payment.getAmount());
            response.setPaymentDate(payment.getPaymentDate());
            response.setPaymentMethod(payment.getPaymentMethod());
            response.setStatus(payment.getStatus());
            response.setAppointmentId(payment.getAppointment().getAppointmentId());
            return response;
        }).toList();
    }
    public PaymentReponse getPaymentsByAppointmentId(Long appointmentId) {
        // Implementation for retrieving payments by appointment ID
        Payment payment = paymentRepository.findByAppointment_AppointmentId(appointmentId);
        if (payment == null) {
            throw new RuntimeException("Payment not found for appointment id: " + appointmentId);
        }
        PaymentReponse response = new PaymentReponse();
        response.setPaymentId(payment.getPaymentId());
        response.setAmount(payment.getAmount());
        response.setPaymentDate(payment.getPaymentDate());
        response.setPaymentMethod(payment.getPaymentMethod());
        response.setStatus(payment.getStatus());
        response.setAppointmentId(payment.getAppointment().getAppointmentId());
        return response;
    }
}
