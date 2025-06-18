package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.entity.Users;
import com.swp.adnV2.AdnV2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class TestAuthController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/test/{username}")
    public ResponseEntity<?> testUserExists(@PathVariable String username) {
        Users user = userRepository.findByUsername(username);
        Map<String, Object> response = new HashMap<>();

        if (user != null) {
            response.put("exists", true);
            response.put("username", user.getUsername());
            response.put("password", user.getPassword());
            response.put("role", user.getRole());
        } else {
            response.put("exists", false);
        }

        return ResponseEntity.ok(response);
    }
}
