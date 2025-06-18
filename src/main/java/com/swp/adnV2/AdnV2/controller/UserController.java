package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.LoginRequest;
import com.swp.adnV2.AdnV2.dto.PasswordResetRequest;
import com.swp.adnV2.AdnV2.dto.ProfileRequest;
import com.swp.adnV2.AdnV2.dto.RegisterRequest;
import com.swp.adnV2.AdnV2.entity.LoginHistory;
import com.swp.adnV2.AdnV2.entity.Role;
import com.swp.adnV2.AdnV2.entity.User;
import com.swp.adnV2.AdnV2.repository.LoginHistoryRepository;
import com.swp.adnV2.AdnV2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LoginHistoryRepository loginHistoryRepository;

    @PostMapping("/login")
    public ResponseEntity<?> checkUser(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        User user = userRepository.findByUsername(username);
        Map<String, Object> response = new HashMap<>();
        if (user != null && user.getPassword() != null && user.getPassword().equals(password)) {
            // Create login history entry
            LoginHistory loginHistory = new LoginHistory();
            loginHistory.setUser(user);
            loginHistory.setLoginTime(LocalDateTime.now());
            loginHistory.setIpAddress(getClientIp(request));
            loginHistory.setUserAgent(request.getHeader("User-Agent"));
            loginHistory.setLoginType("NORMAL");
            loginHistoryRepository.save(loginHistory);

            response.put("Exists", true);
            response.put("message", "Login successful");
            response.put("role", user.getRole());
        } else {
            response.put("Exists", false);
            response.put("message", "Invalid username or password");
        }
        return ResponseEntity.ok(response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0];
        }
        return request.getRemoteAddr();
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        Map<String, Object> response = new HashMap<>();
        if (userRepository.findByUsername(registerRequest.getUsername()) != null) {
            response.put("Success", false);
            response.put("Message", "Username already exists");
            return ResponseEntity.badRequest().body(response);
        } else if (userRepository.findByEmail(registerRequest.getEmail()) != null) {
            response.put("Success", false);
            response.put("Message", "Email already exists");
            return ResponseEntity.badRequest().body(response);
        }
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            response.put("Success", false);
            response.put("Message", "Passwords do not match confirm password");
            return ResponseEntity.badRequest().body(response);
        }
        User user = new User();
        user.setFullName(registerRequest.getFullName());
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword());
        user.setPhone(registerRequest.getPhone());
        user.setAddress(registerRequest.getAddress());
        user.setRole(Role.Customer.name());
        userRepository.save(user);
        response.put("Success", true);
        response.put("Message", "User registered successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest resetPassword) {
        Map<String, Object> response = new HashMap<>();
        User user = userRepository.findByPhone(resetPassword.getPhoneNumber());
        if (user == null) {
            response.put("Success", false);
            response.put("Message", "User not found with this phone number");
            return ResponseEntity.badRequest().body(response);
        } else if (resetPassword.getNewPassword() == null || resetPassword.getNewPassword().isEmpty()) {
            response.put("Success", false);
            response.put("Message", "New password cannot be empty");
            return ResponseEntity.badRequest().body(response);
        } else if (resetPassword.getConfirmPassword() == null || resetPassword.getConfirmPassword().isEmpty()) {
            response.put("Success", false);
            response.put("Message", "Confirm password cannot be empty");
            return ResponseEntity.badRequest().body(response);
        } else if (!resetPassword.getNewPassword().equals(resetPassword.getConfirmPassword())) {
            response.put("Success", false);
            response.put("Message", "New password and confirm password do not match");
            return ResponseEntity.badRequest().body(response);
        } else {
            user.setPassword(resetPassword.getNewPassword());
            userRepository.save(user);
            response.put("Success", true);
            response.put("Message", "Password reset successfully");
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/profile")
<<<<<<< Updated upstream:src/main/java/com/swp/adnV2/AdnV2/controller/UserController.java
    public ResponseEntity<?> getProfile(@RequestParam String username) {
        User user = userRepository.findByUsername(username);
=======
    public ResponseEntity<?> getProfile() {
        // Lấy thông tin người dùng đang đăng nhập từ security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Users user = userRepository.findByUsername(username);
>>>>>>> Stashed changes:Back_end/AdnV2/src/main/java/com/swp/adnV2/AdnV2/controller/UserController.java
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        Map<String, Object> profile = new HashMap<>();
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("phone", user.getPhone());
        profile.put("fullName", user.getFullName());
        profile.put("address", user.getAddress());
        profile.put("dateOfBirth", user.getDateOfBirth());
        profile.put("gender", user.getGender());
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestParam String username, @RequestBody ProfileRequest profileRequest) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        if (profileRequest.getEmail() != null && !profileRequest.getEmail().isEmpty()
                && !profileRequest.getEmail().equals(user.getEmail())) {
            User existingUser = userRepository.findByEmail(profileRequest.getEmail());
            if (existingUser != null) {
                return ResponseEntity.badRequest().body("Email already exists");
            }
            user.setEmail(profileRequest.getEmail());
        }

        if (profileRequest.getFullName() != null && !profileRequest.getFullName().isEmpty()) {
            user.setFullName(profileRequest.getFullName());
        }
        if (profileRequest.getAddress() != null && !profileRequest.getAddress().isEmpty()) {
            user.setAddress(profileRequest.getAddress());
        }
        if (profileRequest.getDateOfBirth() != null) {
            user.setDateOfBirth(profileRequest.getDateOfBirth());
        }
        if (profileRequest.getGender() != null && !profileRequest.getGender().isEmpty()) {
            user.setGender(profileRequest.getGender());
        }
        if (profileRequest.getPhoneNumber() != null && !profileRequest.getPhoneNumber().isEmpty()) {
            user.setPhone(profileRequest.getPhoneNumber());
        }
        if (profileRequest.getEmail() != null && !profileRequest.getEmail().isEmpty()) {
            user.setEmail(profileRequest.getEmail());
        }

        userRepository.save(user);
        return ResponseEntity.ok("Profile updated successfully");
    }

    @GetMapping("/login-history")
    public ResponseEntity<?> getLoginHistory() {
        try {
            List<LoginHistory> history = loginHistoryRepository.findAll();
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Failed to fetch login history");
            return ResponseEntity.badRequest().body(response);
        }
    }
}
