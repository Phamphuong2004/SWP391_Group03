package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.AppointmentRequest;
import com.swp.adnV2.AdnV2.dto.AppointmentResponse;
import com.swp.adnV2.AdnV2.dto.AppointmentUpdateRequest;
import com.swp.adnV2.AdnV2.entity.Appointment;
import com.swp.adnV2.AdnV2.entity.StatusAppointment;
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

    @GetMapping("/get/staff/by-today")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'MANAGER')")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByToDateStaff(){
        return appointmentService.getAppointmentsByToDate();
    }

    @GetMapping("/get/customer/by-today")
    @PreAuthorize("hasAnyRole('CUSTOMER')")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByToDateCustom(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return appointmentService.getAppointmentsByToDateCustomer(username);
    }

    @PostMapping("/create/guest-appointment/{serviceId}")
    public ResponseEntity<?> createGuestAppointment(
            @PathVariable("serviceId") Long serviceId,
            @Valid @RequestBody AppointmentRequest request) {
        return appointmentService.createGuestAppointment(serviceId, request);
    }


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
    @PostMapping("/create-appointment/{serviceId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'MANAGER')")
    public ResponseEntity<?> createAppointment(
            @PathVariable ("serviceId") Long serviceId,
            @Valid @RequestBody AppointmentRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return appointmentService.createAppointment(serviceId ,request, username);
    }

    /**
     * Xem danh sách cuộc hẹn của người dùng đăng ký
     */
    @GetMapping("/view-appointments-user")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'MANAGER')")
    public ResponseEntity<?> viewUserAppointments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return appointmentService.viewAppointments(username);
    }

    /**
     * Xem thông tin chi tiết của một cuộc hẹn
     */
    @GetMapping("/view-appointment/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'MANAGER')")
    public ResponseEntity<?> getAppointmentById(
            @PathVariable("id") Long appointmentId) {
        return appointmentService.getAppointmentById(appointmentId);
    }

    /**
     * Cập nhật trạng thái của cuộc hẹn
     */
    @PutMapping("update/staff/{appointmentId}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> updateAppointment(
            @PathVariable("appointmentId") Long appointmentId,
            @RequestBody AppointmentUpdateRequest updateRequest) {
        return appointmentService.updateAppointment(appointmentId, updateRequest);
    }

    @GetMapping("/view-appointment-guest")
    public ResponseEntity<?> findGuestAppointments(
            @RequestParam String email,
            @RequestParam String phone) {
        return appointmentService.findAppointmentsByEmailAndPhone(email, phone);
    }

    @GetMapping("/get/appointment-by-status")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'MANAGER')")
    public ResponseEntity<?> getAppointmentsByUsernameAndStatus(
            @RequestParam(required = false) String status) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return ResponseEntity.ok(appointmentService.getAppointmentByUsernameAndStatus(username, status));
    }

    @GetMapping("/appointments/by-status")
    @PreAuthorize("hasAnyRole('CUSTOMER','STAFF', 'MANAGER')")
    public ResponseEntity<?> getAllAppointmentsByStatus(@RequestParam String status) {
        try {
            StatusAppointment statusEnum = StatusAppointment.valueOf(status.toUpperCase());
            return ResponseEntity.ok(appointmentService.getAllAppointmentsByStatus(statusEnum.name()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status: " + status);
        }
    }


}
