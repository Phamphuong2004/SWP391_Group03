package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.ParticipantResponse;
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
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

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

    public ResponseEntity<?> createSample(Long appointmentId, SampleRequest sampleRequest, String username) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
        if (!appointmentOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Appointment with ID " + appointmentId + " not found");
        }
        Appointment appointment = appointmentOpt.get();

        KitComponent kitComponent = appointment.getKitComponent();
        if (kitComponent == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Appointment does not have a selected kit component");
        }

        Sample sample = new Sample();
        sample.setAppointment(appointment);
        sample.setSampleType(sampleRequest.getSampleType());
        sample.setCollectedDate(sampleRequest.getCollectedDate() != null ? sampleRequest.getCollectedDate() : LocalDate.now());
        sample.setReceivedDate(sampleRequest.getReceivedDate() != null ? sampleRequest.getReceivedDate() : LocalDate.now());
        sample.setStatus(sampleRequest.getStatus() != null ? sampleRequest.getStatus() : "Pending");
        sample.setKitComponent(kitComponent);
        sample.setUsers(userRepository.findByUsername(username));
        if (sampleRequest.getParticipantId() != null) {
            Participant participant = participantRepository.findById(sampleRequest.getParticipantId())
                    .orElseThrow(() -> new RuntimeException("Participant not found"));
            sample.setParticipant(participant);
        }
        sampleRepository.save(sample);
        SampleResponse response = convertToSampleResponse(sample);
        return ResponseEntity.ok("Sample created successfully");
    }

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

            if (sampleRequest.getParticipantId() != null) {
                Participant participant = participantRepository.findById(sampleRequest.getParticipantId())
                        .orElseThrow(() -> new RuntimeException("Participant not found"));
                sample.setParticipant(participant);
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

            List<Sample> samples = sampleRepository.findByAppointment_AppointmentId(appointmentId);
            if (samples == null || samples.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No sample found for appointment ID " + appointmentId);
            }

            List<SampleResponse> responses = samples.stream()
                    .map(sample -> convertToSampleResponse(sample))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(responses);
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

        if (sample.getParticipant() != null) {
            response.setParticipantId(sample.getParticipant().getParticipantId());
            response.setParticipantFullName(sample.getParticipant().getFullName());
        }
        return response;
    }

    public ResponseEntity<?> updateSampleByAppointmentId(Long appointmentId, SampleRequest request, String username) {
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

            // Kiểm tra yêu cầu tạo mẫu
            if (request.getSampleType() == null || request.getSampleType().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Sample type is required");
            }

            // 4. Lấy toàn bộ sample của appointment (nếu là 1-N)
            List<Sample> samples = sampleRepository.findByAppointment_AppointmentId(appointmentId);
            if (samples == null || samples.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No sample found for appointment ID " + appointmentId);
            }

            // 5. Cập nhật toàn bộ sample (hoặc chọn sample phù hợp nếu muốn)
            for (Sample sample : samples) {
                // Update các trường nếu có
                sample.setSampleType(request.getSampleType());

                if (request.getCollectedDate() != null) {
                    sample.setCollectedDate(request.getCollectedDate());
                }
                if (request.getReceivedDate() != null) {
                    sample.setReceivedDate(request.getReceivedDate());
                }
                if (request.getStatus() != null && !request.getStatus().isEmpty()) {
                    sample.setStatus(request.getStatus());
                }
                sample.setUsers(currentUser);

                if (request.getParticipantId() != null) {
                    Participant participant = participantRepository.findById(request.getParticipantId())
                            .orElseThrow(() -> new RuntimeException("Participant not found"));
                    sample.setParticipant(participant);
                }

                sampleRepository.save(sample); // Lưu từng sample
            }
            return ResponseEntity.ok("Sample updated successfully for appointment ID: " + appointmentId);
        } catch (Exception e){
            System.err.println("Error updating sample for appointment ID " + appointmentId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating sample: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getParticipantsByAppointmentId(Long appointmentId) {
        List<Sample> samples = sampleRepository.findByAppointment_AppointmentId(appointmentId);
        if (samples == null || samples.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No sample found for appointment ID " + appointmentId);
        }
        // Sử dụng Set để loại trùng participant nếu cần
        Set<Participant> participants = samples.stream()
                .map(Sample::getParticipant)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // Nếu muốn trả về DTO (nên như vậy)
        Set<ParticipantResponse> participantResponses = participants.stream().map(participant -> {
            ParticipantResponse dto = new ParticipantResponse();
            dto.setParticipantId(participant.getParticipantId());
            dto.setFullName(participant.getFullName());
            dto.setGender(participant.getGender());
            dto.setDateOfBirth(participant.getDateOfBirth());
            dto.setPhoneNumber(participant.getPhone());
            dto.setEmail(participant.getEmail());
            return dto;
        }).collect(Collectors.toSet());

        return ResponseEntity.ok(participantResponses);
    }

//    private KitComponent findKitComponentFromAppointment(Appointment appointment) {
//        // Nếu appointment có liên kết với service, tìm kit component từ service
//        if (appointment.getService() != null) {
//            List<KitComponent> serviceKitComponents = kitComponentRepository.findByService_ServiceId(
//                    appointment.getService().getServiceId());
//
//            if (!serviceKitComponents.isEmpty()) {
//                return serviceKitComponents.get(0); // Lấy KitComponent đầu tiên
//            }
//        }
//
//        // Kiểm tra xem có KitComponent nào đã được dùng cho appointment này chưa
//        List<Sample> existingSamples = sampleRepository.findByAppointment_AppointmentId(appointment.getAppointmentId());
//        if (!existingSamples.isEmpty() && existingSamples.get(0).getKitComponent() != null) {
//            return existingSamples.get(0).getKitComponent();
//        }
//
//        // Không tìm thấy KitComponent phù hợp
//        return null;
//    }


}
