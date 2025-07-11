package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.GuestResponse;
import com.swp.adnV2.AdnV2.entity.Appointment;
import com.swp.adnV2.AdnV2.entity.Guest;
import com.swp.adnV2.AdnV2.repository.AppointmentRepository;
import com.swp.adnV2.AdnV2.repository.GuestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class GuestService {
    @Autowired
    private GuestRepository guestRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public GuestResponse convertGuestToResponse(Guest guest) {
        if (guest == null) {
            return null;
        }
        GuestResponse response = new GuestResponse();
        response.setGuestId(guest.getGuestId());
        response.setFullName(guest.getFullName());
        response.setGender(guest.getGender());
        response.setDateOfBirth(guest.getDateOfBirth());
        response.setPhone(guest.getPhone());
        response.setEmail(guest.getEmail());

        return response;
    }

    public ResponseEntity<?> getGuestByPhone(String phone) {
        Optional<Guest> guestOptional = guestRepository.findByPhone(phone);
        if (!guestOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Guest guest = guestOptional.get();
        GuestResponse response = convertGuestToResponse(guest);
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> getGuestById(Long guestId){
        Optional<Guest> guestOptional = guestRepository.findById(guestId);
        if(!guestOptional.isPresent()){
            return ResponseEntity.notFound().build();
        }
        Guest guest = guestOptional.get();
        GuestResponse response = convertGuestToResponse(guest);
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> getGuestByAppointmentId(Long appointmentId) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
        if (!appointmentOpt.isPresent() || appointmentOpt.get().getGuest() == null) {
            return ResponseEntity.notFound().build();
        }
        Guest guest = appointmentOpt.get().getGuest();
        GuestResponse response = convertGuestToResponse(guest);
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> deleteGuestById(Long guestId) {
        guestRepository.deleteById(guestId);
        return ResponseEntity.ok("Guest deleted successfully");
    }
}
