package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.AppointmentRequest;
import com.swp.adnV2.AdnV2.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AppointmentAPI {
    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/create")
    public ResponseEntity<?> createAppointment(@RequestParam String username,
                                               @RequestBody AppointmentRequest request) {
        return appointmentService.createAppointment(username, request);
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentRequest request,
                                               @RequestParam(required = false) String username) {
        // Logic xử lý dựa trên username (có hoặc không)
        return appointmentService.createAppointment(request, username);
    }

    @GetMapping("/view")
    public ResponseEntity<?> viewAppointments(@RequestParam String username) {
        return appointmentService.viewAppointments(username);
    }
}
