package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.AppointmentRequest;
import com.swp.adnV2.AdnV2.entity.Appointment;
import com.swp.adnV2.AdnV2.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AppointmentController {
    @Autowired
    private AppointmentService appointmentService;

    /**
     * Tạo cuộc hẹn mới (cho cả người dùng đăng ký và khách vãng lai)
     */
    @PostMapping
    public ResponseEntity<?> createAppointment(
            @Valid @RequestBody AppointmentRequest request,
            @RequestParam(required = false) String username) {
        return appointmentService.createAppointment(request, username);
    }

    /**
     * Xem danh sách cuộc hẹn của người dùng đăng ký
     */
    @GetMapping("/user")
    public ResponseEntity<?> viewUserAppointments(
            @RequestParam String username) {
        return appointmentService.viewAppointments(username);
    }

    /**
     * Xem thông tin chi tiết của một cuộc hẹn
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(
            @PathVariable("id") Long appointmentId) {
        return appointmentService.getAppointmentById(appointmentId);
    }

    /**
     * Cập nhật trạng thái của cuộc hẹn
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(
            @PathVariable("id") Long appointmentId,
            @RequestParam String status) {
        return appointmentService.updateAppointmentStatus(appointmentId, status);
    }


    /**
     * Tìm kiếm cuộc hẹn cho người dùng không có tài khoản
     */
    @GetMapping("/guest")
    public ResponseEntity<?> findGuestAppointments(
            @RequestParam String email,
            @RequestParam String phone) {
        return appointmentService.findAppointmentsByEmailAndPhone(email, phone);
    }



//    @PostMapping("/appointments")
//    public ResponseEntity<?> createAppointmentV2(@RequestBody AppointmentRequest request,
//                                               @RequestParam(required = false) String username) {
//        try {
//            Appointment appointment = appointmentService.createAppointment(request, username);
//            return ResponseEntity.status(HttpStatus.CREATED).body(appointment);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body("Failed to create appointment: " + e.getMessage());
//        }
//    }
}
