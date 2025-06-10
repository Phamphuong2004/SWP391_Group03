package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.AppointmentRequest;
import com.swp.adnV2.AdnV2.entity.Appointment;
import com.swp.adnV2.AdnV2.entity.User;
import com.swp.adnV2.AdnV2.repository.AppointmentRepository;
import com.swp.adnV2.AdnV2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class AppointmentService {
    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<?> createAppointment(String username, AppointmentRequest request){
        User user = userRepository.findByUsername(username);
        if(user == null){
            return ResponseEntity.badRequest().body("User not found");
        }

        Appointment appointment = new Appointment();
        appointment.setUser(user);//
        appointment.setFullName(request.getFullName());//
        appointment.setDob(request.getDob());//
        appointment.setPhone(request.getPhone());//
        appointment.setEmail(request.getEmail());
        appointment.setGender(request.getGender());
        appointment.setTestPurpose(request.getTestPurpose());
        appointment.setAdnTestType(request.getAdnTestType());
        appointment.setServiceType(request.getServiceType());

        appointment.setCollectionSampleTime(request.getCollectionTime());

//        appointment.setFingerprintFile(request.getFingerprintFile());

        if (request.getFingerprintFile() == null || request.getFingerprintFile().trim().isEmpty()) {
            appointment.setFingerprintFile(null);
        } else {
            appointment.setFingerprintFile(request.getFingerprintFile());
        }

        appointment.setDistrict(request.getDistrict());
        appointment.setProvince(request.getProvince());

        appointmentRepository.save(appointment);

        return ResponseEntity.ok("Appointment created successfully");

    }
}
