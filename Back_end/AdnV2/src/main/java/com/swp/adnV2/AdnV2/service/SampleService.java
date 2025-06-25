package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.SampleRequest;
import com.swp.adnV2.AdnV2.dto.SampleResponse;
import com.swp.adnV2.AdnV2.entity.*;
import com.swp.adnV2.AdnV2.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SampleService {
    @Autowired
    private SampleRepository sampleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private KitRepository kitComponentRepository;

    @Autowired
    private ParticipantRepsitory participantRepository;

    public ResponseEntity<?> softDeleteSample(Long sampleId, String username) {
        try {
            // Kiểm tra thông tin người dùng
            Users currentUser = userRepository.findByUsername(username);
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            // Kiểm tra mẫu tồn tại
            Optional<Sample> sampleOpt = sampleRepository.findById(sampleId);
            if (!sampleOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Sample with ID " + sampleId + " not found");
            }

            Sample sample = sampleOpt.get();

            // Đổi trạng thái thành "Deleted"
            sample.setStatus("Deleted");
            sample.setUsers(currentUser); // Lưu người thực hiện xóa

            // Lưu thông tin cập nhật
            sampleRepository.save(sample);

            return ResponseEntity.ok("Sample with ID " + sampleId + " has been soft deleted");
        } catch (Exception e) {
            System.err.println("Error soft deleting sample with ID " + sampleId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error soft deleting sample: " + e.getMessage());
        }
    }

    public ResponseEntity<?> deleteSample(Long sampleId, String username){
        try {
            Users currentUser = userRepository.findByUsername(username);
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            // Kiểm tra mẫu tồn tại
            Optional<Sample> sampleOpt = sampleRepository.findById(sampleId);
            if (!sampleOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Sample with ID " + sampleId + " not found");
            }

            Sample sample = sampleOpt.get();
            sampleRepository.delete(sample);
            return ResponseEntity.ok("Sample with ID " + sampleId + " has been deleted");
        } catch (Exception e) {
            System.err.println("Error deleting sample with ID " + sampleId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting sample: " + e.getMessage());
        }
    }

    public ResponseEntity<?> updateSample(Long sampleId, SampleRequest sampleRequest, String username) {
        try{
            Users currentUser = userRepository.findByUsername(username);
            if (currentUser == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            Optional<Sample> optionalSample = sampleRepository.findById(sampleId);
            if (!optionalSample.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Sample with ID " + sampleId + " not found");
            }
            Sample sample = optionalSample.get();
            if(sampleRequest.getSampleType() != null && !sampleRequest.getSampleType().trim().isEmpty()) {
                sample.setSampleType(sampleRequest.getSampleType());
            }

            if(sampleRequest.getCollectedDate() != null){
                sample.setCollectedDate(sampleRequest.getCollectedDate());
            }

            if(sampleRequest.getReceivedDate() != null) {
                sample.setReceivedDate(sampleRequest.getReceivedDate());
            }

            if(sampleRequest.getStatus() != null && !sampleRequest.getStatus().trim().isEmpty()) {
                sample.setStatus(sampleRequest.getStatus());
            }

            sample.setUsers(currentUser);   //cap nhat nguoi sua doi

            Sample savedSample = sampleRepository.save(sample);
            SampleResponse response = convertToSampleResponse(savedSample);
            return ResponseEntity.ok("Updated sample successfully");
        } catch (Exception e) {
            System.err.println("Error updating sample with ID " + sampleId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating sample: " + e.getMessage());
        }

    }


    public ResponseEntity<?> getSampleByAppointmentId(Long appointmentId) {
        try{
            Optional<Appointment> optionalAppointment = appointmentRepository.findById(appointmentId);
            if(!optionalAppointment.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Appointment with ID " + appointmentId + " not found");
            }

            //lấy danh sách mẫu theo appointmentId
            List<Sample> samples = sampleRepository.findByAppointment_AppointmentId(appointmentId);
            if (samples.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No samples found for appointment ID " + appointmentId);
            }
            List<SampleResponse> responseList = samples.stream()
                    .map(this::convertToSampleResponse)
                    .collect(java.util.stream.Collectors.toList());

            return ResponseEntity.ok(responseList);
        } catch (Exception e) {
            System.err.println("Error getting samples for appointment ID " + appointmentId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error getting samples: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getSampleById(Long sampleId) {
        try{
            Optional<Sample> sample = sampleRepository.findById(sampleId);
            if(!sample.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Sample with ID " + sampleId + " not found");
            }
            SampleResponse response = convertToSampleResponse(sample.get());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Ghi log lỗi
            System.err.println("Error retrieving sample with ID " + sampleId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving sample: " + e.getMessage());
        }
    }

    private SampleResponse convertToSampleResponse(Sample sample) {
        SampleResponse response = new SampleResponse();

        response.setSampleId(sample.getSampleId());
        response.setSampleType(sample.getSampleType());
        response.setCollectedDate(sample.getCollectedDate());
        response.setReceivedDate(sample.getReceivedDate());
        response.setStatus(sample.getStatus());

        if (sample.getUsers() != null) {
            response.setUsername(sample.getUsers().getUsername());
        }
        if (sample.getKitComponent() != null) {
            response.setKitComponentName(sample.getKitComponent().getComponentName());
        }
        return response;
    }

    public ResponseEntity<?> createSampleByAppointmentId(Long appointmentId, SampleRequest request, String username) {
        try{
            Users currentUser = userRepository.findByUsername(username);
            if(currentUser == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
            if (!appointmentOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Appointment with ID " + appointmentId + " not found");
            }

            Appointment appointment = appointmentOpt.get();
            // Kiểm tra yêu cầu tạo mẫu
            if (request.getSampleType() == null || request.getSampleType().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Sample type is required");
            }


            Sample sample = new Sample();
            sample.setSampleType(request.getSampleType());
            if( request.getCollectedDate() != null) {
                sample.setCollectedDate(request.getCollectedDate());
            }else if (appointment.getCollectionSampleTime() != null) {
                sample.setCollectedDate(appointment.getCollectionSampleTime().toLocalDate());
            } else {
                sample.setCollectedDate(LocalDate.now());
            }

            sample.setReceivedDate(request.getReceivedDate());

            // Thiết lập trạng thái
            if (request.getStatus() != null && !request.getStatus().isEmpty()) {
                sample.setStatus(request.getStatus());
            } else {
                // Thêm trạng thái mặc định
                sample.setStatus("Created");
            }
            sample.setUsers(currentUser);
            sample.setAppointment(appointment);
            KitComponent kitComponent = findKitComponentFromAppointment(appointment);
            if (kitComponent != null) {
                sample.setKitComponent(kitComponent);
            } else {
                return ResponseEntity.badRequest().body("No suitable KitComponent found for this appointment");
            }

            appointmentRepository.save(appointment);

            Sample savedSample = sampleRepository.save(sample);
            return ResponseEntity.ok("Sample created successfully with ID: " + savedSample.getSampleId());
        } catch (Exception e){
            // Ghi log lỗi
            System.err.println("Error creating sample for appointment ID " + appointmentId + ": " + e.getMessage());
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating sample: " + e.getMessage());
        }
    }

    private KitComponent findKitComponentFromAppointment(Appointment appointment) {
        // Nếu appointment có liên kết với service, tìm kit component từ service
        if (appointment.getService() != null) {
            List<KitComponent> serviceKitComponents = kitComponentRepository.findByService_ServiceId(
                    appointment.getService().getServiceId());

            if (!serviceKitComponents.isEmpty()) {
                return serviceKitComponents.get(0); // Lấy KitComponent đầu tiên
            }
        }

        // Kiểm tra xem có KitComponent nào đã được dùng cho appointment này chưa
        List<Sample> existingSamples = sampleRepository.findByAppointment_AppointmentId(appointment.getAppointmentId());
        if (!existingSamples.isEmpty() && existingSamples.get(0).getKitComponent() != null) {
            return existingSamples.get(0).getKitComponent();
        }

        // Không tìm thấy KitComponent phù hợp
        return null;
    }


}
