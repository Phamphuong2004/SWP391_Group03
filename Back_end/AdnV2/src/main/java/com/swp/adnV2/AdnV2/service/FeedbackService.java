package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.FeedbackRequest;
import com.swp.adnV2.AdnV2.dto.FeedbackResponse;
import com.swp.adnV2.AdnV2.entity.Feedback;
import com.swp.adnV2.AdnV2.entity.Users;
import com.swp.adnV2.AdnV2.repository.FeedbackReppsitory;
import com.swp.adnV2.AdnV2.repository.ServicesRepository;
import com.swp.adnV2.AdnV2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackReppsitory feedbackReppsitory;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServicesRepository servicesRepository;

    public ResponseEntity<?> updateFeedback(String username, Long feedbackId, FeedbackRequest feedbackRequest) {
        try {
            // Tìm feedback cần cập nhật
            Feedback feedback = feedbackReppsitory.findById(feedbackId)
                    .orElseThrow(() -> new RuntimeException("Feedback not found with ID: " + feedbackId));

            // Kiểm tra xem người dùng hiện tại có phải là người tạo feedback này không
            Users currentUser = userRepository.findByUsername(username);
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not found");
            }

            // Kiểm tra quyền sở hữu feedback (nếu cần)
            if (!feedback.getUser().getUsername().equals(username)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You don't have permission to update this feedback");
            }

            // Cập nhật thông tin feedback
            feedback.setContent(feedbackRequest.getContent());
            feedback.setRating(feedbackRequest.getRating());

            // Không cần cập nhật user vì chúng ta đang kiểm tra quyền sở hữu
            // feedback.setUser(currentUser);

            feedbackReppsitory.save(feedback);
            return ResponseEntity.ok("Feedback updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating feedback: " + e.getMessage());
        }
    }

    public ResponseEntity<?> deleteFeedback(Long feedbackId) {
        try {
            if (!feedbackReppsitory.existsById(feedbackId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Feedback with ID " + feedbackId + " not found.");
            }
            feedbackReppsitory.deleteById(feedbackId);
            return ResponseEntity.ok("Feedback deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting feedback: " + e.getMessage());
        }
    }

    public ResponseEntity<?> searchFeedback(String serviceName, String keyword) {
        try {
            List<Feedback> feedbacks;
            if(serviceName != null && !serviceName.isEmpty() && keyword != null && !keyword.isEmpty()) {
                feedbacks = feedbackReppsitory.findByServiceNameAndKeyword(serviceName, keyword);
            } else if(serviceName != null && !serviceName.isEmpty()) {
                feedbacks = feedbackReppsitory.findByServiceName(serviceName);
            } else if(keyword != null && !keyword.isEmpty()) {
                feedbacks = feedbackReppsitory.findByKeyword(keyword);
            } else {
                feedbacks = feedbackReppsitory.findAll();
            }

            if (feedbacks.isEmpty()) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            // Chuyển đổi kết quả sang DTO để trả về
            List<FeedbackResponse> response = feedbacks.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Đã xảy ra lỗi khi tìm kiếm feedback: " + e.getMessage());
        }
    }

    public ResponseEntity<?> createFeedback(String username, Long serviceId,FeedbackRequest feedbackRequest) {
        Feedback feedback = new Feedback();
        feedback.setUser(userRepository.findByUsername(username));
        feedback.setContent(feedbackRequest.getContent());
        feedback.setRating(feedbackRequest.getRating());
        feedback.setService(servicesRepository.getReferenceById(serviceId));
        feedbackReppsitory.save(feedback);
        return ResponseEntity.ok("Create feedback successfully.");
    }

    public FeedbackResponse convertToDto(Feedback feedback) {
        FeedbackResponse feedbackResponse = new FeedbackResponse();
        feedbackResponse.setFullName(feedback.getUser().getFullName());
        feedbackResponse.setContent(feedback.getContent());
        feedbackResponse.setRating(feedback.getRating());
        feedbackResponse.setFeedbackDate(feedback.getFeedbackDate());
        feedbackResponse.setServiceName(feedback.getService().getServiceName());
        return feedbackResponse;
    }
}
