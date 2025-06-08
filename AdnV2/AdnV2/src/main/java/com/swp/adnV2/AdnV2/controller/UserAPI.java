package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.LoginRequest;
import com.swp.adnV2.AdnV2.entity.User;
import com.swp.adnV2.AdnV2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class UserAPI {
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/api/login")
    public ResponseEntity<?> checkUser(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        User user = userRepository.findByUsername(username);
        Map<String, Object> response = new HashMap<>();
        if (user != null && user.getPassword() != null && user.getPassword().equals(password)) {
            response.put("Exists", true);
            response.put("message", "Login successful");
            response.put("role", user.getRole());
        } else {
            response.put("Exists", false);
            response.put("message", "Invalid username or password");
        }
        return ResponseEntity.ok(response);
    }
}
