package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.config.JwtUtil;
import com.swp.adnV2.AdnV2.dto.*;
import com.swp.adnV2.AdnV2.entity.LoginHistory;
import com.swp.adnV2.AdnV2.entity.Role;
import com.swp.adnV2.AdnV2.entity.Users;
import com.swp.adnV2.AdnV2.repository.LoginHistoryRepository;
import com.swp.adnV2.AdnV2.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LoginHistoryRepository loginHistoryRepository;

    public ResponseEntity<?> passwordReset(PasswordResetRequest resetPassword) {

        Map<String, Object> response = new HashMap<>();

        // 1. Phone number null hoặc rỗng
        if (resetPassword.getPhoneNumber() == null || resetPassword.getPhoneNumber().isEmpty()) {
            response.put("Success", false);
            response.put("Message", "Phone number cannot be empty");
            return ResponseEntity.badRequest().body(response);
        }

        // 2. Phone number sai định dạng
        if (!resetPassword.getPhoneNumber().matches("^0\\d{9,10}$")) {
            response.put("Success", false);
            response.put("Message", "Invalid phone number format");
            return ResponseEntity.badRequest().body(response);
        }

        // 3. Password null hoặc rỗng
        if (resetPassword.getNewPassword() == null || resetPassword.getNewPassword().isEmpty()) {
            response.put("Success", false);
            response.put("Message", "New password cannot be empty");
            return ResponseEntity.badRequest().body(response);
        }

        // 4. Confirm password null hoặc rỗng
        if (resetPassword.getConfirmPassword() == null || resetPassword.getConfirmPassword().isEmpty()) {
            response.put("Success", false);
            response.put("Message", "Confirm password cannot be empty");
            return ResponseEntity.badRequest().body(response);
        }

        // 5. Password phải đủ độ dài
        if (resetPassword.getNewPassword().length() < 6) {
            response.put("Success", false);
            response.put("Message", "Password must be at least 6 characters");
            return ResponseEntity.badRequest().body(response);
        }

        // 6. Password và confirm phải giống nhau
        if (!resetPassword.getNewPassword().equals(resetPassword.getConfirmPassword())) {
            response.put("Success", false);
            response.put("Message", "New password and confirm password do not match");
            return ResponseEntity.badRequest().body(response);
        }

        // 7. Kiểm tra user tồn tại
        Users users = userRepository.findByPhone(resetPassword.getPhoneNumber());
        if (users == null) {
            response.put("Success", false);
            response.put("Message", "User not found with this phone number");
            return ResponseEntity.badRequest().body(response);
        }

        // 8. Lưu mật khẩu mới
        users.setPassword(resetPassword.getNewPassword());
        userRepository.save(users);
        response.put("Success", true);
        response.put("Message", "Password reset successfully");
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> checkVar(RegisterRequest registerRequest) {
        Map<String, Object> response = new HashMap<>();
        //1. Username bị trống
        if(registerRequest.getUsername() == null || registerRequest.getUsername().isEmpty()){
            response.put("Status", false);
            response.put("Message", "Username cannot be empty");
            return ResponseEntity.badRequest().body(response);
        }

        //2. Password bị trống
        if(registerRequest.getPassword() == null || registerRequest.getPassword().isEmpty()){
            response.put("Status", false);
            response.put("Message", "Password cannot be empty");
            return ResponseEntity.badRequest().body(response);
        }

        //3. Email bị trống
        if(registerRequest.getEmail() == null || registerRequest.getEmail().isEmpty()){
            response.put("Status", false);
            response.put("Message", "Email cannot be empty");
            return ResponseEntity.badRequest().body(response);
        }

        //4. Phone bị trống
        if(registerRequest.getPhone() == null || registerRequest.getPhone().isEmpty()){
            response.put("Status", false);
            response.put("Message", "Phone cannot be empty");
            return ResponseEntity.badRequest().body(response);
        }

        //5. Email và Phone phải đúng định dạng
        if (!registerRequest.getEmail().matches("^[\\w.-]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
            response.put("Success", false);
            response.put("Message", "Invalid email format");
            return ResponseEntity.badRequest().body(response);
        }

        if (!registerRequest.getPhone().matches("^0\\d{9,10}$")) {
            response.put("Success", false);
            response.put("Message", "Invalid phone number format");
            return ResponseEntity.badRequest().body(response);
        }
        return null; //hợp lệ, ko lỗi.
    }

    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        ResponseEntity<?> checkResult = checkVar(registerRequest);
        if (checkResult != null) {
            return checkResult;
        }
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

    public ResponseEntity<?> checkAuthenticate(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
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

    public ResponseEntity<?> getUsers(String username) {
        Users users = userRepository.findByUsername(username);
        if (users == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        ProfileResponse profileResponse = new ProfileResponse();
        profileResponse.setUsername(users.getUsername());
        profileResponse.setEmail(users.getEmail());
        profileResponse.setPhoneNumber(users.getPhone());
        profileResponse.setFullName(users.getFullName());
        profileResponse.setAddress(users.getAddress());
        if (users.getDateOfBirth() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            profileResponse.setDateOfBirth(users.getDateOfBirth().format(formatter));
        } else {
            profileResponse.setDateOfBirth(null);
        }
        profileResponse.setGender(users.getGender());
        if (users.getAvatar() != null && !users.getAvatar().isEmpty()) {
            profileResponse.setAvatar(users.getAvatar());
        } else {
            profileResponse.setAvatar(null);
        }
        return ResponseEntity.ok(profileResponse);
    }

    public ResponseEntity<?> updateUsers(
            String username,
            String email,
            String phoneNumber,
            String fullName,
            String address,
            LocalDate dateOfBirth,
            String gender,
            MultipartFile avatar
    ) {
        Users users = userRepository.findByUsername(username);
        if (users == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        // 1. Kiểm tra và cập nhật email
        if (email != null && !email.isEmpty() && !email.equals(users.getEmail())) {
            // Kiểm tra định dạng email
            if (!email.matches("^[\\w.-]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
                return ResponseEntity.badRequest().body("Invalid email format");
            }
            // Kiểm tra email đã tồn tại
            Users existingUsers = userRepository.findByEmail(email);
            if (existingUsers != null) {
                return ResponseEntity.badRequest().body("Email already exists");
            }
            users.setEmail(email);
        }

        if (fullName != null && !fullName.isEmpty()) {
            users.setFullName(fullName);
        }
        if (address != null && !address.isEmpty()) {
            users.setAddress(address);
        }
        if (dateOfBirth != null) {
            users.setDateOfBirth(dateOfBirth);
        }
        if (gender != null && !gender.isEmpty()) {
            users.setGender(gender);
        }
        if (phoneNumber != null && !phoneNumber.isEmpty()) {
            if (!phoneNumber.matches("^0\\d{9,10}$")) {
                return ResponseEntity.badRequest().body("Invalid phone number format");
            }
            users.setPhone(phoneNumber);
        }

        if (avatar != null && !avatar.isEmpty()) {
            users.setAvatar(users.getAvatar());
        }

        userRepository.save(users);
        return ResponseEntity.ok("Profile updated successfully");
    }
}
