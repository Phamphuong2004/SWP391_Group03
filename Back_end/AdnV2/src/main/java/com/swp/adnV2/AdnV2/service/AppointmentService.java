package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.AppointmentRequest;
import com.swp.adnV2.AdnV2.dto.AppointmentResponse;
import com.swp.adnV2.AdnV2.dto.AppointmentUpdateRequest;
import com.swp.adnV2.AdnV2.entity.*;
import com.swp.adnV2.AdnV2.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

    @Autowired
    private KitRepository kitRepository;

    @Autowired
    private SampleRepository sampleRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private GuestRepository guestRepository;

    @Autowired
    private GuestAppointmentRepository guestAppointmentRepository;


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
            appointment.setCollectionLocation(request.getCollectionLocation());
            appointment.setStatus("PENDING");

            Services services = serviceRepository.findServicesByServiceId(serviceId);
            if (services == null) {
                throw new IllegalArgumentException("Service not found with ID: " + serviceId);
            }
            appointment.setService(services);

            KitComponent kitComponent = kitRepository.findByComponentName(request.getKitComponentName());
            if (kitComponent == null) {
                return ResponseEntity.badRequest().body("Invalid kit component name");
            }
            appointment.setKit(kitComponent);



            Sample sample = new Sample();
            sample.setSampleType(request.getSampleType());
            sample.setKitComponent(kitComponent);
            sample.setAppointment(appointment);

            appointment.setSample(sample);
            appointment = appointmentRepository.save(appointment);

            Guest guest = new Guest();
            guest.setFullName(request.getFullName());
            guest.setGender(request.getGender());
            guest.setDateOfBirth(request.getDob());
            guest.setPhone(request.getPhone());
            guest.setEmail(request.getEmail());
            guestRepository.save(guest);

            GuestAppointment guestAppointment = new GuestAppointment();
            guestAppointment.setGuest(guest);
            guestAppointment.setAppointment(appointment);
            guestAppointmentRepository.save(guestAppointment);


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
        response.setCollectionLocation(appointment.getCollectionLocation());
        response.setDistrict(appointment.getDistrict());
        response.setProvince(appointment.getProvince());
        response.setStatus(appointment.getStatus());
        response.setAppointmentDate(appointment.getAppointmentDate());
        response.setUserId(appointment.getUserId());

        // Lấy kitComponentName từ Sample đầu tiên (nếu có)
        String kitComponentName = null;
        if (appointment.getKit() != null) {
            kitComponentName = appointment.getKit().getComponentName();
        }

        response.setKitComponentName(kitComponentName);

        Sample sample = sampleRepository.findByAppointment_AppointmentId(appointment.getAppointmentId());
        if (sample != null) {
            response.setKitComponentName(
                    sample.getKitComponent() != null ? sample.getKitComponent().getComponentName() : null
            );
            response.setSampleType(sample.getSampleType());

            // Lấy result từ sample
            Result result = resultRepository.findBySample_SampleId(sample.getSampleId());
            if (result != null) {
                response.setResultFile(result.getResultData()); // Hoặc getResultFile() nếu đặt tên khác
            } else {
                response.setResultFile(null);
            }
        }else {
            response.setResultFile(null);
        }

        // Lấy paymentStatus từ Payment (nếu có)
        Payment payment = paymentRepository.findByAppointment_AppointmentId(appointment.getAppointmentId());
        if (payment != null) {
            response.setPaymentStatus(payment.getStatus());
        } else {
            response.setPaymentStatus(null); // hoặc "Pending" tùy nghiệp vụ
        }

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
        appointment.setCollectionLocation(request.getCollectionLocation());
        appointment.setDistrict(request.getDistrict());
        appointment.setProvince(request.getProvince());
        Services services = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new IllegalArgumentException("Service not found with ID: " + serviceId));
        appointment.setService(services);

        // Xử lý kit (nếu có)
        KitComponent kitComponent = null;
        if (request.getKitComponentName() != null && !request.getKitComponentName().isEmpty()) {
            kitComponent = kitRepository.findByComponentName(request.getKitComponentName());
            if (kitComponent == null) {
                return ResponseEntity.badRequest().body("Invalid kit component name");
            }
            appointment.setKit(kitComponent);
        }

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
        // Create Sample
        Sample sample = new Sample();
        sample.setAppointment(appointment);
        sample.setUsers(appointment.getUser());
        sample.setCollectedDate(LocalDate.now());

        // Set kitComponent nếu có, nếu không thì sẽ là null
        sample.setKitComponent(kitComponent);

        // Set sampleType nếu có, nếu không thì sẽ là null
        if (request.getSampleType() != null && !request.getSampleType().isEmpty()) {
            sample.setSampleType(request.getSampleType());
        } else {
            sample.setSampleType(null);
        }
        sampleRepository.save(sample);
        AppointmentResponse response = convertToAppointmentResponse(appointment);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
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
            AppointmentResponse response = convertToAppointmentResponse(appointment.get());
            return ResponseEntity.ok(response);
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
            boolean updatedSample = false;

            // Kiểm tra và cập nhật kit_component_name nếu được cung cấp
            if (updateRequest.getKit_component_name() != null && !updateRequest.getKit_component_name().isEmpty()) {
                // Lấy service từ appointment
                Services service = appointment.getService();
                if (service == null) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Appointment does not have an associated service");
                }

                Long serviceId = service.getServiceId();

                // Tìm kiếm KitComponent trong service này với tên đã cho
                List<KitComponent> matchingComponents = kitRepository.findByService_ServiceIdAndComponentNameContainingIgnoreCase(
                        serviceId, updateRequest.getKit_component_name());

                if (matchingComponents.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("No kit component with name '" + updateRequest.getKit_component_name() +
                                    "' found for the service ID " + serviceId);
                }

                // Lấy KitComponent đầu tiên khớp (hoặc có thể thêm logic để chọn cái phù hợp nhất)
                KitComponent kitComponent = matchingComponents.get(0);

                Sample sample = sampleRepository.findByAppointment_AppointmentId(appointmentId);
                if (sample != null) {
                    sample.setKitComponent(kitComponent);
                    if (updateRequest.getSampleType() != null && !updateRequest.getSampleType().isEmpty()) {
                        sample.setSampleType(updateRequest.getSampleType());
                    }
                    sampleRepository.save(sample);
                    updatedSample = true;
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("No sample found for the appointment ID " + appointmentId);
                }

            }

            // Cập nhật file kết quả nếu được cung cấp (giờ sẽ cập nhật vào Result)
            if (updateRequest.getResultFile() != null && !updateRequest.getResultFile().isEmpty()) {
                Sample sample = sampleRepository.findByAppointment_AppointmentId(appointmentId);
                if (sample != null) {
                    Result result = resultRepository.findBySample_SampleId(sample.getSampleId());
                    if (result != null) {
                        result.setResultData(updateRequest.getResultFile());
                        resultRepository.save(result);
                    }
                    // Nếu chưa có result, bạn có thể tạo mới ở đây nếu nghiệp vụ yêu cầu
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("No sample found for the appointment ID " + appointmentId);
                }
            }

            appointmentRepository.save(appointment);
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

}
