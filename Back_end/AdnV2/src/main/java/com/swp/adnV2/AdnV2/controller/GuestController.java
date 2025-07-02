package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.service.GuestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/guest")
public class GuestController {
    @Autowired
    private GuestService guestService;

    @GetMapping("/get/id/{guestId}")
    public ResponseEntity<?> getGuestById(@PathVariable Long guestId) {
        return guestService.getGuestById(guestId);
    }

    @GetMapping("/get/phone/{phone}")
    public ResponseEntity<?> getGuestByPhone(@PathVariable String phone) {
        return guestService.getGuestByPhone(phone);
    }

    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> getGuestByAppointmentId(Long appointmentId) {
        return guestService.getGuestByAppointmentId(appointmentId);
    }
}
