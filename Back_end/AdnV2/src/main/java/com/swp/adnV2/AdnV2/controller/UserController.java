package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.LoginRequest;
import com.swp.adnV2.AdnV2.dto.PasswordResetRequest;
import com.swp.adnV2.AdnV2.dto.ProfileRequest;
import com.swp.adnV2.AdnV2.dto.RegisterRequest;
import com.swp.adnV2.AdnV2.entity.LoginHistory;
import com.swp.adnV2.AdnV2.entity.Role;
import com.swp.adnV2.AdnV2.entity.Users;
import com.swp.adnV2.AdnV2.repository.LoginHistoryRepository;
import com.swp.adnV2.AdnV2.repository.UserRepository;
import com.swp.adnV2.AdnV2.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> checkUser(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        Users users = userRepository.findByUsername(username);
        Map<String, Object> response = new HashMap<>();
        if (users != null && users.getPassword() != null && users.getPassword().equals(password)) {
            // Create login history entry
            LoginHistory loginHistory = new LoginHistory();
            loginHistory.setUsers(users);
            loginHistory.setLoginTime(LocalDateTime.now());
            loginHistory.setIpAddress(getClientIp(request));
            loginHistory.setUserAgent(request.getHeader("User-Agent"));
            loginHistory.setLoginType("NORMAL");
            loginHistoryRepository.save(loginHistory);

            response.put("Exists", true);
            response.put("message", "Login successful");
            response.put("role", users.getRole());
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
        Users users = new Users();
        users.setFullName(registerRequest.getFullName());
        users.setUsername(registerRequest.getUsername());
        users.setEmail(registerRequest.getEmail());
        users.setPassword(registerRequest.getPassword());
        users.setPhone(registerRequest.getPhone());
        users.setAddress(registerRequest.getAddress());
        users.setRole(Role.CUSTOMER.name());
        userRepository.save(users);
        response.put("Success", true);
        response.put("Message", "User registered successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest resetPassword) {
        Map<String, Object> response = new HashMap<>();
        Users users = userRepository.findByPhone(resetPassword.getPhoneNumber());
        if (users == null) {
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
            users.setPassword(resetPassword.getNewPassword());
            userRepository.save(users);
            response.put("Success", true);
            response.put("Message", "Password reset successfully");
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'MANAGER')")
    public ResponseEntity<?> getProfile() {
        // Get authenticated user information from security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.getUsers(username);
    }

    @PostMapping("/profile/update")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'MANAGER')")
    public ResponseEntity<?> updateProfile(@RequestBody ProfileRequest profileRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.updateUsers(username, profileRequest);
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

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/api/manager/updaterole")
    public ResponseEntity<?> managerUpdateRole(@RequestParam String username, @RequestParam String newRole) {
        Map<String, Object> response = new HashMap<>();
        Users user = userRepository.findByUsername(username);
        if (user == null) {
            response.put("Success", false);
            response.put("Message", "User not found");
            return ResponseEntity.badRequest().body(response);
        }
        try {
            Role role = Role.valueOf(newRole.toUpperCase());
            user.setRole(role.name());
            userRepository.save(user);
            response.put("Success", true);
            response.put("Message", "User role updated successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("Success", false);
            response.put("Message", "Invalid role");
            return ResponseEntity.badRequest().body(response);
        }
    }
}
