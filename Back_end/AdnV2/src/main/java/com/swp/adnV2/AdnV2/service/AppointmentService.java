package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.AppointmentRequest;
import com.swp.adnV2.AdnV2.entity.Appointment;
import com.swp.adnV2.AdnV2.entity.StatusAppointment;
import com.swp.adnV2.AdnV2.entity.User;
import com.swp.adnV2.AdnV2.repository.AppointmentRepository;
import com.swp.adnV2.AdnV2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {
    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Appointment> getAppointmentByUsernameAndStatus(String username, String status) {;
        if(status != null && !status.isEmpty()){
            try {
                StatusAppointment statusEnum = StatusAppointment.valueOf(status.toUpperCase());
                return appointmentRepository.findByUser_UsernameAndStatus(username, status);
            } catch (IllegalArgumentException e) {
                // Xử lý exception khi status không hợp lệ
                throw new RuntimeException("Invalid status: " + status);
            }
        } else {
            // Nếu status không được cung cấp hoặc rỗng, trả về tất cả appointment của user có phân trang
            return appointmentRepository.findByUser_Username(username);
        }
    }



    /**
     * Tạo cuộc hẹn mới
     * @param request Thông tin cuộc hẹn
     * @param username Tên người dùng (nếu có)
     * @return ResponseEntity chứa thông tin cuộc hẹn hoặc thông báo lỗi
     */
public ResponseEntity<?> createAppointment(AppointmentRequest request, String username) {
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

        // Thêm các thông tin mặc định
        appointment.setStatus("PENDING"); // Trạng thái mặc định khi tạo cuộc hẹn

        // Xử lý user (nếu có)
        if (username != null && !username.trim().isEmpty()) {
            User user = userRepository.findByUsername(username);
            if (user != null) {
                appointment.setUser(user);
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
    public ResponseEntity<?> viewAppointments(String username) {
        try {
            User user = userRepository.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User with username " + username + " not found");
            }

            List<Appointment> appointments = appointmentRepository.findByUser_UserId(user.getUserId());
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Failed to retrieve appointments: " + e.getMessage());
        }
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

    /**
     * Cập nhật trạng thái của cuộc hẹn
     * @param appointmentId ID của cuộc hẹn
     * @param status Trạng thái mới
     * @return ResponseEntity chứa thông tin cuộc hẹn hoặc thông báo lỗi
     */
    public ResponseEntity<?> updateAppointmentStatus(Long appointmentId, String status) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
        if (appointmentOpt.isPresent()) {
            Appointment appointment = appointmentOpt.get();
            appointment.setStatus(status);
            appointment = appointmentRepository.save(appointment);
            return ResponseEntity.ok(appointment);
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
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Failed to find appointments: " + e.getMessage());
        }
    }
    //

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

    public ResponseEntity<?> viewAppointmentsV2(String username) {
        try {
            User user = userRepository.findByUsername(username);
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            List<Appointment> appointments = appointmentRepository.findByUser_UserId(user.getUserId());
            if (appointments.isEmpty()) {
                return ResponseEntity.badRequest().body("No appointments found for this user");
            }

            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving appointments: " + e.getMessage());
        }
    }
}
