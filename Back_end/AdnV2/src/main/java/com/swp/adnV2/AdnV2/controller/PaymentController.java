package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.PaymentCreationRequest;
import com.swp.adnV2.AdnV2.dto.PaymentReponse;
import com.swp.adnV2.AdnV2.dto.PaymentUpdateRequest;
import com.swp.adnV2.AdnV2.entity.Payment;
import com.swp.adnV2.AdnV2.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create")
    @PreAuthorize("permitAll()")
    public PaymentReponse createPayment(@RequestBody PaymentCreationRequest request) {
        // Logic to create a payment
        return paymentService.createPayment(request); // Replace with actual implementation
    }
    @GetMapping("/{paymentId}")
    @PreAuthorize("permitAll()")
    public PaymentReponse getPaymentById(@PathVariable Long paymentId) {
        // Logic to retrieve a payment by ID
        return paymentService.getPaymentById(paymentId); // Replace with actual implementation
    }
    @DeleteMapping("/{paymentId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> deletePayment(@PathVariable Long paymentId) {
        // Logic to delete a payment
        paymentService.deletePayment(paymentId); // Replace with actual implementation
        return ResponseEntity.ok().build();
    }
    @PutMapping("/{paymentId}")
    @PreAuthorize("permitAll()")
    public PaymentReponse updatePayment(@PathVariable Long paymentId, @RequestBody PaymentUpdateRequest request) {
        // Logic to update a payment
        return paymentService.updatePayment(paymentId, request); // Replace with actual implementation
    }
    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public List<PaymentReponse> getAllPayments() {
        // Logic to retrieve all payments
        return paymentService.getAllPayments(); // Replace with actual implementation
    }
    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("permitAll()")
    public PaymentReponse getPaymentsByAppointmentId(@PathVariable Long appointmentId) {
        // Logic to retrieve payments by appointment ID
        return paymentService.getPaymentsByAppointmentId(appointmentId); // Replace with actual implementation
    }

    @PostMapping("/refund/{appointmentId}")
    @PreAuthorize("permitAll()")
    public PaymentReponse refundPayment(@PathVariable Long appointmentId) {
        // Logic to refund a payment
        return paymentService.refundPayment(appointmentId); // Replace with actual implementation
    }

    @PostMapping("/set-payment-status/refund/{appointmentId}")
    @PreAuthorize("permitAll()")
    public String setPaymentStatusRefund(@PathVariable Long appointmentId) {
        // Logic to set payment status to refunded
        return paymentService.setPaymentStatusRefund(appointmentId); // Replace with actual implementation
    }
}
