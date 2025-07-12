package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.FeedbackRequest;
import com.swp.adnV2.AdnV2.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {
    @Autowired
    private FeedbackService feedbackService;


    @GetMapping("/search/by-service-name/{serviceName}")
    @PreAuthorize("hasAnyRole('GUEST', 'CUSTOMER', 'STAFF', 'MANAGER')")
    public ResponseEntity<?> searchFeedbacksByServiceName(@PathVariable String serviceName, @RequestParam(required = false) String keyword) {
        return feedbackService.searchFeedback(serviceName, keyword);
    }

    @PostMapping("/create/{serviceId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'MANAGER')")
    public ResponseEntity<?> createFeedback(@PathVariable Long serviceId,@RequestBody FeedbackRequest feedbackRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return feedbackService.createFeedback(username, serviceId ,feedbackRequest);
    }

    @PutMapping("/update/{feedbackId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'MANAGER')")
    public ResponseEntity<?> updateFeedback(@PathVariable Long feedbackId, @RequestBody FeedbackRequest feedbackRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return feedbackService.updateFeedback(username, feedbackId, feedbackRequest);
    }

    @DeleteMapping("/delete/{feedbackId}")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long feedbackId) {
        return feedbackService.deleteFeedback(feedbackId);
    }
}
