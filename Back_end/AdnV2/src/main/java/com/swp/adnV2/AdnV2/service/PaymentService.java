package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.PaymentCreationRequest;
import com.swp.adnV2.AdnV2.dto.PaymentReponse;
import com.swp.adnV2.AdnV2.dto.PaymentUpdateRequest;
import com.swp.adnV2.AdnV2.entity.Appointment;
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
    public PaymentReponse refundPayment(Long appointmentId) {
        // Implementation for refunding a payment
        Payment payment = paymentRepository.findByAppointment_AppointmentId(appointmentId);
        PaymentReponse response = new PaymentReponse();
        if (payment == null) {
            response.setNote("Payment not found for appointment id: " + appointmentId);
            return response; // or throw an exception if preferred
        }
        if (!"Completed".equalsIgnoreCase(payment.getStatus())) {
            response.setNote("Payment is not completed, cannot process refund.");
            return response; // or throw an exception if preferred
        }

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElse(null);;
        if (appointment == null) {
            response.setNote("Appointment not found with id: " + appointmentId);
            return response; // or throw an exception if preferred
        }else if (!appointment.getActive()) {
            response.setNote("Appointment is not active, cannot process refund.");
            return response; // or throw an exception if preferred
        }else if ("PENDING".equalsIgnoreCase(appointment.getStatus()) || "CONFIRMED".equalsIgnoreCase(appointment.getStatus())) {
            response.setPaymentId(payment.getPaymentId());
            response.setAmount(payment.getAmount());
            response.setPaymentDate(payment.getPaymentDate());
            response.setPaymentMethod(payment.getPaymentMethod());
            response.setStatus(payment.getStatus());
            response.setAppointmentId(payment.getAppointment().getAppointmentId());
            return response;
        }else if ("SEND".equalsIgnoreCase(appointment.getStatus()) || "RECEIVED".equalsIgnoreCase(appointment.getStatus())) {
            double refundAmount = payment.getAmount() * 0.5; // Assuming a 50% refund policy

            response.setPaymentId(payment.getPaymentId());
            response.setAmount(refundAmount);
            response.setPaymentDate(payment.getPaymentDate());
            response.setPaymentMethod(payment.getPaymentMethod());
            response.setStatus(payment.getStatus());
            response.setAppointmentId(payment.getAppointment().getAppointmentId());
            return response;
        }else if("INPROCESS".equalsIgnoreCase(appointment.getStatus())) {
            double refundAmount = payment.getAmount() * 0.25; // Assuming a 25% refund policy

            response.setPaymentId(payment.getPaymentId());
            response.setAmount(refundAmount);
            response.setPaymentDate(payment.getPaymentDate());
            response.setPaymentMethod(payment.getPaymentMethod());
            response.setStatus(payment.getStatus());
            response.setAppointmentId(payment.getAppointment().getAppointmentId());
            return response;
        }else {
            response.setPaymentId(payment.getPaymentId());
            response.setAmount(0);
            response.setPaymentDate(payment.getPaymentDate());
            response.setPaymentMethod(payment.getPaymentMethod());
            response.setStatus(payment.getStatus());
            response.setAppointmentId(payment.getAppointment().getAppointmentId());
            return response;
        }
    }
    public String setPaymentStatusRefund(Long appointmentId) {
        // Implementation for setting the status of a payment
        Payment payment = paymentRepository.findByAppointment_AppointmentId(appointmentId);
        if (payment == null) {
            return "Payment not found for appointment id: " + appointmentId;
        }
        if (!"Completed".equalsIgnoreCase(payment.getStatus())) {
            return "Payment is not completed, cannot process refund.";
        }
        payment.setStatus("Refunded");
        paymentRepository.save(payment);
        return "Payment status updated to Refunded for appointment id: " + appointmentId;
    }
}
