package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.FeedbackRequest;
import com.swp.adnV2.AdnV2.entity.Feedback;
import com.swp.adnV2.AdnV2.entity.Services;
import com.swp.adnV2.AdnV2.entity.Users;
import com.swp.adnV2.AdnV2.repository.FeedbackRepository;
import com.swp.adnV2.AdnV2.repository.ServiceRepository;
import com.swp.adnV2.AdnV2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<?> createFeedback(String username, String serviceId, FeedbackRequest feedbackRequest) {
        if(username == null || username.isEmpty()){
            return ResponseEntity.badRequest().body("Username is required");
        }
        if(serviceId == null || serviceId.isEmpty()) {
            return ResponseEntity.badRequest().body("Service ID is required");
        }
        if(feedbackRequest.getContent() == null || feedbackRequest.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Content cannot be empty");
        }

        // Kiểm tra giới hạn rating
        if(feedbackRequest.getRating() < 1 || feedbackRequest.getRating() > 5) {
            return ResponseEntity.badRequest().body("Rating must be between 1 and 5");
        }

        Users user = userRepository.findByUsername(username);
        if(user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found with username: " + username);
        }

        // Find service
        Long serviceIdLong;
        try {
            serviceIdLong = Long.parseLong(serviceId);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid service ID format");
        }
        Services services = serviceRepository.findServicesByServiceId(Long.parseLong(serviceId));
        if (services == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Service not found with ID: " + serviceId);
        }
        Feedback feedback = new Feedback();
        feedback.setContent(feedbackRequest.getContent());
        feedback.setRating(feedbackRequest.getRating());
        feedback.setUser(user);
        feedback.setService(services);
        feedback.setFeedbackDate(LocalDateTime.now());
        feedbackRepository.save(feedback);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Feedback created successfully");
    }
}
