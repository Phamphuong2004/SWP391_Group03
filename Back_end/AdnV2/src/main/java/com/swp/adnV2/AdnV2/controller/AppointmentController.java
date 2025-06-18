package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.AppointmentRequest;
import com.swp.adnV2.AdnV2.entity.Appointment;
import com.swp.adnV2.AdnV2.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AppointmentController {
    @Autowired
    private AppointmentService appointmentService;

    /**
     * Tạo cuộc hẹn mới (cho cả người dùng đăng ký và khách vãng lai)
     */
    @PostMapping("/create-appointment")
    public ResponseEntity<?> createAppointment(
            @Valid @RequestBody AppointmentRequest request,
            @RequestParam(required = false) String username) {
        return appointmentService.createAppointment(request, username);
    }

    /**
     * Xem danh sách cuộc hẹn của người dùng đăng ký
     */
    @GetMapping("/view-appointments-user")
    public ResponseEntity<?> viewUserAppointments(
            @RequestParam String username) {
        return appointmentService.viewAppointments(username);
    }

    /**
     * Xem thông tin chi tiết của một cuộc hẹn
     */
    @GetMapping("/view-appointment/{id}")
    public ResponseEntity<?> getAppointmentById(
            @PathVariable("id") Long appointmentId) {
        return appointmentService.getAppointmentById(appointmentId);
    }

    /**
     * Cập nhật trạng thái của cuộc hẹn
     */
    @PutMapping("/update-status/{id}")
    public ResponseEntity<?> updateAppointmentStatus(
            @PathVariable("id") Long appointmentId,
            @RequestParam String status) {
        return appointmentService.updateAppointmentStatus(appointmentId, status);
    }


    /**
     * Tìm kiếm cuộc hẹn cho người dùng không có tài khoản
     */
    @GetMapping("/view-appointment-guest")
    public ResponseEntity<?> findGuestAppointments(
            @RequestParam String email,
            @RequestParam String phone) {
        return appointmentService.findAppointmentsByEmailAndPhone(email, phone);
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<?> getAppointmentsByUsernameAndStatus(
            @PathVariable String username,
            @RequestParam(required = false) String status) {

        return ResponseEntity.ok(appointmentService.getAppointmentByUsernameAndStatus(username, status));
    }
}
