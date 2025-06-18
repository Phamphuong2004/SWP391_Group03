package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.AppointmentRequest;
import com.swp.adnV2.AdnV2.dto.AppointmentResponse;
import com.swp.adnV2.AdnV2.dto.AppointmentUpdateRequest;
import com.swp.adnV2.AdnV2.entity.Appointment;
import com.swp.adnV2.AdnV2.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AppointmentController {
    @Autowired
    private AppointmentService appointmentService;


    @DeleteMapping("/delete-appointment/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> deleteAppointment(@PathVariable("id") Long appointmentId) {
        return appointmentService.deleteAppointment(appointmentId);
    }

    @GetMapping("/get-all-appointments")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<List<AppointmentResponse>> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

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
    public ResponseEntity<?> viewUserAppointments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
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
    @PutMapping("/update-appointment/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> updateAppointment(
            @PathVariable("id") Long appointmentId,
            @RequestBody AppointmentUpdateRequest updateRequest) {
        return appointmentService.updateAppointment(appointmentId, updateRequest);
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
            @RequestParam(required = false) String status) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return ResponseEntity.ok(appointmentService.getAppointmentByUsernameAndStatus(username, status));
    }
}
