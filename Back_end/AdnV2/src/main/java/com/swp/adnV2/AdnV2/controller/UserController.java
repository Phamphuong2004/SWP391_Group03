package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.*;
import com.swp.adnV2.AdnV2.entity.LoginHistory;
import com.swp.adnV2.AdnV2.entity.Role;
import com.swp.adnV2.AdnV2.entity.Users;
import com.swp.adnV2.AdnV2.repository.LoginHistoryRepository;
import com.swp.adnV2.AdnV2.repository.UserRepository;
import com.swp.adnV2.AdnV2.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
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
        return userService.checkAuthenticate(loginRequest, request);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        return userService.registerUser(registerRequest);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest resetPassword) {
        return userService.passwordReset(resetPassword);
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
    public ResponseEntity<?> updateProfile(
            @RequestParam(value = "avatar", required = false) MultipartFile avatar,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
            @RequestParam(value = "fullName", required = false) String fullName,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "dateOfBirth", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateOfBirth,
            @RequestParam(value = "gender", required = false) String gender
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.updateUsers(username, email, phoneNumber, fullName, address, dateOfBirth, gender, avatar);
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
