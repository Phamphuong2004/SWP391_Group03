package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.FeedbackRequest;
import com.swp.adnV2.AdnV2.entity.Feedback;
import com.swp.adnV2.AdnV2.repository.FeedbackRepository;
import com.swp.adnV2.AdnV2.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {
    @Autowired
    private FeedbackService feedbackService;


    @PostMapping("/services/{serviceId}/users/{username}")
    public ResponseEntity<?> createFeedback(@PathVariable("username") String username,
                                            @PathVariable("serviceId") Long serviceId,
                                            @RequestBody FeedbackRequest feedbackRequest) {
        ResponseEntity<?> response = feedbackService.createFeedback(username, serviceId.toString(), feedbackRequest);

        return response;
    }
}
