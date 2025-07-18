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

    @Autowired
    private SampleTypeRepository sampleTypeRepository;

    public ResponseEntity<?> createCollectedSample(Long appointmentId, SampleRequest sampleRequest, String username) {
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

        // Lấy SampleType từ DB
        SampleType sampleType = null;
        if (sampleRequest.getSampleType() != null && !sampleRequest.getSampleType().trim().isEmpty()) {
            Optional<SampleType> optionalSampleType = sampleTypeRepository.findByName(sampleRequest.getSampleType());
            if (optionalSampleType.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Sample type not found: " + sampleRequest.getSampleType());
            }
            sampleType = optionalSampleType.get();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Sample type is required");
        }

        CollectedSample collectedSample = new CollectedSample();
        collectedSample.setAppointment(appointment);
        collectedSample.setSampleType(sampleType);
        collectedSample.setCollectedDate(sampleRequest.getCollectedDate() != null ? sampleRequest.getCollectedDate() : LocalDate.now());
        collectedSample.setReceivedDate(sampleRequest.getReceivedDate() != null ? sampleRequest.getReceivedDate() : LocalDate.now());
        collectedSample.setStatus(sampleRequest.getStatus() != null ? sampleRequest.getStatus() : "Pending");
        collectedSample.setKitComponent(kitComponent);
        collectedSample.setUsers(userRepository.findByUsername(username));
        if (sampleRequest.getParticipantId() != null) {
            Participant participant = participantRepository.findById(sampleRequest.getParticipantId())
                    .orElseThrow(() -> new RuntimeException("Participant not found"));
            collectedSample.setParticipant(participant);
        }
        sampleRepository.save(collectedSample);
        SampleResponse response = convertToSampleResponse(collectedSample);
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
            Optional<CollectedSample> sampleOpt = sampleRepository.findById(sampleId);
            if (!sampleOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Sample with ID " + sampleId + " not found");
            }

            CollectedSample collectedSample = sampleOpt.get();

            // Đổi trạng thái thành "Deleted"
            collectedSample.setStatus("Deleted");
            collectedSample.setUsers(currentUser); // Lưu người thực hiện xóa

            // Lưu thông tin cập nhật
            sampleRepository.save(collectedSample);

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
            Optional<CollectedSample> sampleOpt = sampleRepository.findById(sampleId);
            if (!sampleOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Sample with ID " + sampleId + " not found");
            }

            CollectedSample collectedSample = sampleOpt.get();
            sampleRepository.delete(collectedSample);
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

            Optional<CollectedSample> optionalSample = sampleRepository.findById(sampleId);
            if (!optionalSample.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Sample with ID " + sampleId + " not found");
            }
            CollectedSample collectedSample = optionalSample.get();
            if (sampleRequest.getSampleType() != null && !sampleRequest.getSampleType().trim().isEmpty()) {
                Optional<SampleType> optionalSampleType = sampleTypeRepository.findByName(sampleRequest.getSampleType());
                if (optionalSampleType.isEmpty()) {
                    return ResponseEntity.badRequest().body("Sample type not found: " + sampleRequest.getSampleType());
                }
                SampleType sampleType = optionalSampleType.get();
                collectedSample.setSampleType(sampleType);
            }

            if(sampleRequest.getCollectedDate() != null){
                collectedSample.setCollectedDate(sampleRequest.getCollectedDate());
            }

            if(sampleRequest.getReceivedDate() != null) {
                collectedSample.setReceivedDate(sampleRequest.getReceivedDate());
            }

            if(sampleRequest.getStatus() != null && !sampleRequest.getStatus().trim().isEmpty()) {
                collectedSample.setStatus(sampleRequest.getStatus());
            }

            if (sampleRequest.getParticipantId() != null) {
                Participant participant = participantRepository.findById(sampleRequest.getParticipantId())
                        .orElseThrow(() -> new RuntimeException("Participant not found"));
                collectedSample.setParticipant(participant);
            }

            collectedSample.setUsers(currentUser);   //cap nhat nguoi sua doi

            CollectedSample savedCollectedSample = sampleRepository.save(collectedSample);
            SampleResponse response = convertToSampleResponse(savedCollectedSample);
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

            List<CollectedSample> collectedSamples = sampleRepository.findByAppointment_AppointmentId(appointmentId);
            if (collectedSamples == null || collectedSamples.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No sample found for appointment ID " + appointmentId);
            }

            List<SampleResponse> responses = collectedSamples.stream()
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
            Optional<CollectedSample> sample = sampleRepository.findById(sampleId);
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

    private SampleResponse convertToSampleResponse(CollectedSample collectedSample) {
        SampleResponse response = new SampleResponse();

        response.setSampleId(collectedSample.getSampleId());
        response.setSampleType(
                collectedSample.getSampleType() != null ? collectedSample.getSampleType().getName() : null
        );
        response.setCollectedDate(collectedSample.getCollectedDate());
        response.setReceivedDate(collectedSample.getReceivedDate());
        response.setStatus(collectedSample.getStatus());

        if (collectedSample.getUsers() != null) {
            response.setUsername(collectedSample.getUsers().getUsername());
        }
        if (collectedSample.getKitComponent() != null) {
            response.setKitComponentName(collectedSample.getKitComponent().getComponentName());
        }

        if (collectedSample.getParticipant() != null) {
            response.setParticipantId(collectedSample.getParticipant().getParticipantId());
            response.setParticipantFullName(collectedSample.getParticipant().getFullName());
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

            Optional<SampleType> optionalSampleType = sampleTypeRepository.findByName(request.getSampleType());
            if (optionalSampleType.isEmpty()) {
                return ResponseEntity.badRequest().body("Sample type not found: " + request.getSampleType());
            }

            SampleType sampleType = optionalSampleType.get();

            // 4. Lấy toàn bộ sample của appointment (nếu là 1-N)
            List<CollectedSample> collectedSamples = sampleRepository.findByAppointment_AppointmentId(appointmentId);
            if (collectedSamples == null || collectedSamples.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No sample found for appointment ID " + appointmentId);
            }

            // 5. Cập nhật toàn bộ sample (hoặc chọn sample phù hợp nếu muốn)
            for (CollectedSample collectedSample : collectedSamples) {
                // Update các trường nếu có
                collectedSample.setSampleType(sampleType);

                if (request.getCollectedDate() != null) {
                    collectedSample.setCollectedDate(request.getCollectedDate());
                }
                if (request.getReceivedDate() != null) {
                    collectedSample.setReceivedDate(request.getReceivedDate());
                }
                if (request.getStatus() != null && !request.getStatus().isEmpty()) {
                    collectedSample.setStatus(request.getStatus());
                }
                collectedSample.setUsers(currentUser);

                if (request.getParticipantId() != null) {
                    Participant participant = participantRepository.findById(request.getParticipantId())
                            .orElseThrow(() -> new RuntimeException("Participant not found"));
                    collectedSample.setParticipant(participant);
                }

                sampleRepository.save(collectedSample); // Lưu từng sample
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
        List<CollectedSample> collectedSamples = sampleRepository.findByAppointment_AppointmentId(appointmentId);
        if (collectedSamples == null || collectedSamples.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No sample found for appointment ID " + appointmentId);
        }
        // Sử dụng Set để loại trùng participant nếu cần
        Set<Participant> participants = collectedSamples.stream()
                .map(CollectedSample::getParticipant)
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
