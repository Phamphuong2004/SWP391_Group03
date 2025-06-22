package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.AppointmentRequest;
import com.swp.adnV2.AdnV2.dto.AppointmentResponse;
import com.swp.adnV2.AdnV2.dto.AppointmentUpdateRequest;
import com.swp.adnV2.AdnV2.entity.*;
import com.swp.adnV2.AdnV2.repository.AppointmentRepository;
import com.swp.adnV2.AdnV2.repository.ParticipantRepsitory;
import com.swp.adnV2.AdnV2.repository.ServiceRepository;
import com.swp.adnV2.AdnV2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AppointmentService {
    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private ParticipantRepsitory participantRepository;


    public ResponseEntity<?> createGuestAppointment(Long serviceId, AppointmentRequest request ){
        try {
            Appointment appointment = new Appointment();
            LocalDateTime appointmentDateTime = request.getAppointmentDate();
            if(appointmentDateTime != null){
                appointment.setAppointmentDate(appointmentDateTime);
        } else {
                throw new IllegalArgumentException("Appointment date is required");
            }

            appointment.setFullName(request.getFullName());
            appointment.setDob(request.getDob());
            appointment.setPhone(request.getPhone());
            appointment.setEmail(request.getEmail());
            appointment.setGender(request.getGender());
            appointment.setTestPurpose(request.getTestPurpose());
            appointment.setServiceType(request.getServiceType());
            appointment.setCollectionSampleTime(request.getCollectionTime());
            appointment.setTestCategory(request.getTestCategory());
            appointment.setFingerprintFile(request.getFingerprintFile());
            appointment.setDistrict(request.getDistrict());
            appointment.setProvince(request.getProvince());

            appointment.setStatus("PENDING");

            Services services = serviceRepository.findServicesByServiceId(serviceId);
            if (services == null) {
                throw new IllegalArgumentException("Service not found with ID: " + serviceId);
            }
            appointment.setService(services);

            appointment = appointmentRepository.save(appointment);

            //Tạo participant và liên kết với appointment
            Participant participant = new Participant();
            participant.setAppointment(appointment);
            participant.setFullName(request.getFullName());
            participant.setDateOfBirth(request.getDob());
            participant.setPhone(request.getPhone());
            participant.setEmail(request.getEmail());
            participant.setGender(request.getGender());
            participantRepository.save(participant);

            AppointmentResponse response = convertToAppointmentResponse(appointment);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e){
            return ResponseEntity.badRequest()
                    .body("Failed to create appointment: " + e.getMessage());
        }
    }


    public ResponseEntity<?> deleteAppointment(Long appointmentId) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
        if (appointmentOpt.isPresent()) {
            appointmentRepository.delete(appointmentOpt.get());
            return ResponseEntity.ok("Appointment deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Appointment with ID " + appointmentId + " not found");
        }
    }

    public AppointmentResponse convertToAppointmentResponse(Appointment appointment) {
        AppointmentResponse response = new AppointmentResponse();
        response.setAppointmentId(appointment.getAppointmentId());
        response.setFullName(appointment.getFullName());
        response.setDob(appointment.getDob());
        response.setPhone(appointment.getPhone());
        response.setEmail(appointment.getEmail());
        response.setGender(appointment.getGender());
        response.setTestPurpose(appointment.getTestPurpose());
        response.setTestCategory(appointment.getTestCategory());
        response.setServiceType(appointment.getServiceType());
        response.setCollectionSampleTime(appointment.getCollectionSampleTime());
        response.setFingerprintFile(appointment.getFingerprintFile());
        response.setDistrict(appointment.getDistrict());
        response.setProvince(appointment.getProvince());
        response.setStatus(appointment.getStatus());
        response.setResultFile(appointment.getResultFile());
        response.setAppointmentDate(appointment.getAppointmentDate());
        response.setUserId(appointment.getUserId());
        return response;
    }

    public ResponseEntity<List<AppointmentResponse>> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        if (appointments.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        List<AppointmentResponse> responseList = appointments.stream()
                .map(this::convertToAppointmentResponse) // Sử dụng method reference nếu có thể
                .collect(Collectors.toList());
        return new ResponseEntity<>(responseList, HttpStatus.OK);
    }


    public List<Appointment> getAppointmentByUsernameAndStatus(String username, String status) {;
        if(status != null && !status.isEmpty()){
            try {
                StatusAppointment statusEnum = StatusAppointment.valueOf(status.toUpperCase());
                return appointmentRepository.findByUsers_UsernameAndStatus(username, status);
            } catch (IllegalArgumentException e) {
                // Xử lý exception khi status không hợp lệ
                throw new RuntimeException("Invalid status: " + status);
            }
        } else {
            // Nếu status không được cung cấp hoặc rỗng, trả về tất cả appointment của user có phân trang
            return appointmentRepository.findByUsers_Username(username);
        }
    }



    /**
     * Tạo cuộc hẹn mới
     * @param request Thông tin cuộc hẹn
     * @param username Tên người dùng (nếu có)
     * @return ResponseEntity chứa thông tin cuộc hẹn hoặc thông báo lỗi
     */
public ResponseEntity<?> createAppointment(Long serviceId,AppointmentRequest request, String username) {
    try {
        Appointment appointment = new Appointment();

        // Sửa ở đây - Thay vì dùng String, lấy trực tiếp LocalDateTime
        LocalDateTime appointmentDateTime = request.getAppointmentDate();
        if (appointmentDateTime != null) {
            appointment.setAppointmentDate(appointmentDateTime);
        } else {
            throw new IllegalArgumentException("Appointment date is required");
        }
        appointment.setFullName(request.getFullName());
        appointment.setDob(request.getDob());
        appointment.setPhone(request.getPhone());
        appointment.setEmail(request.getEmail());
        appointment.setGender(request.getGender());
        appointment.setTestPurpose(request.getTestPurpose());
        appointment.setServiceType(request.getServiceType());
        appointment.setCollectionSampleTime(request.getCollectionTime());
        appointment.setTestCategory(request.getTestCategory());
        appointment.setFingerprintFile(request.getFingerprintFile());
        appointment.setDistrict(request.getDistrict());
        appointment.setProvince(request.getProvince());
        appointment.setAppointmentDate(request.getAppointmentDate());
        Services services = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new IllegalArgumentException("Service not found with ID: " + serviceId));
        appointment.setService(services);

        // Thêm các thông tin mặc định
        appointment.setStatus("PENDING"); // Trạng thái mặc định khi tạo cuộc hẹn

        // Xử lý user (nếu có)
        if (username != null && !username.trim().isEmpty()) {
            Users users = userRepository.findByUsername(username);
            if (users != null) {
                appointment.setUser(users);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User with username " + username + " not found");
            }
        }

        // Lưu appointment
        appointment = appointmentRepository.save(appointment);
        return ResponseEntity.status(HttpStatus.CREATED).body(appointment);
    } catch (Exception e) {
        return ResponseEntity.badRequest()
                .body("Failed to create appointment: " + e.getMessage());
    }
}


    /**
     * Xem danh sách cuộc hẹn của người dùng
     * @param username Tên người dùng
     * @return ResponseEntity chứa danh sách cuộc hẹn hoặc thông báo lỗi
     */

    public ResponseEntity<?> viewAppointments(String username){
        Users user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User with username " + username + " not found");
        }
        List<Appointment> appointments = appointmentRepository.findByUsers_UserId(user.getUserId());

        List<AppointmentResponse> responseList = appointments.stream()
                .map(this::convertToAppointmentResponse)
                .collect(Collectors.toList());
        return new ResponseEntity<>(responseList, HttpStatus.OK);
    }



    /**
     * Xem thông tin chi tiết của một cuộc hẹn
     * @param appointmentId ID của cuộc hẹn
     * @return ResponseEntity chứa thông tin cuộc hẹn hoặc thông báo lỗi
     */
    public ResponseEntity<?> getAppointmentById(Long appointmentId) {
        Optional<Appointment> appointment = appointmentRepository.findById(appointmentId);
        if (appointment.isPresent()) {
            return ResponseEntity.ok(appointment.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Appointment with ID " + appointmentId + " not found");
        }
    }


    public ResponseEntity<?> updateAppointment(Long appointmentId, AppointmentUpdateRequest updateRequest) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
        if (appointmentOpt.isPresent()) {
            Appointment appointment = appointmentOpt.get();

            // Cập nhật trạng thái nếu được cung cấp
            if (updateRequest.getStatus() != null && !updateRequest.getStatus().isEmpty()) {
                appointment.setStatus(updateRequest.getStatus());
            }

            // Cập nhật file kết quả nếu được cung cấp
            if (updateRequest.getResultFile() != null && !updateRequest.getResultFile().isEmpty()) {
                appointment.setResultFile(updateRequest.getResultFile());
            }

            appointment = appointmentRepository.save(appointment);
            return ResponseEntity.ok("Appointment updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Appointment with ID " + appointmentId + " not found");
        }
    }

    /**
     * Tìm kiếm cuộc hẹn cho người dùng không có tài khoản
     * @param email Email người dùng
     * @param phone Số điện thoại người dùng
     * @return ResponseEntity chứa danh sách cuộc hẹn hoặc thông báo lỗi
     */
    public ResponseEntity<?> findAppointmentsByEmailAndPhone(String email, String phone) {
        try {
            List<Appointment> appointments = appointmentRepository.findByEmailAndPhone(email, phone);
            if (appointments.isEmpty()) {
                return ResponseEntity.ok(Collections.emptyList());
            }
            List<AppointmentResponse> responseList = appointments.stream()
                    .map(this::convertToAppointmentResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responseList);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Failed to find appointments: " + e.getMessage());
        }
    }

//    public ResponseEntity<?> createAppointment(String username, AppointmentRequest request){
//        Users users = userRepository.findByUsername(username);
//        if(users == null){
//            return ResponseEntity.badRequest().body("User not found");
//        }
//
//        Appointment appointment = new Appointment();
//        appointment.setUser(users);//
//        appointment.setFullName(request.getFullName());//
//        appointment.setDob(request.getDob());//
//        appointment.setPhone(request.getPhone());//
//        appointment.setEmail(request.getEmail());
//        appointment.setGender(request.getGender());
//        appointment.setTestPurpose(request.getTestPurpose());
//        appointment.setServiceType(request.getServiceType());
//
//        appointment.setCollectionSampleTime(request.getCollectionTime());
//
//
//        if (request.getFingerprintFile() == null || request.getFingerprintFile().trim().isEmpty()) {
//            appointment.setFingerprintFile(null);
//        } else {
//            appointment.setFingerprintFile(request.getFingerprintFile());
//        }
//
//        appointment.setDistrict(request.getDistrict());
//        appointment.setProvince(request.getProvince());
//
//        appointmentRepository.save(appointment);
//
//        return ResponseEntity.ok("Appointment created successfully");
//
//    }

    public ResponseEntity<?> viewAppointmentsV2(String username) {
        try {
            Users users = userRepository.findByUsername(username);
            if (users == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            List<Appointment> appointments = appointmentRepository.findByUsers_UserId(users.getUserId());
            if (appointments.isEmpty()) {
                return ResponseEntity.badRequest().body("No appointments found for this user");
            }

            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving appointments: " + e.getMessage());
        }
    }
}
