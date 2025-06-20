package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.ProfileRequest;
import com.swp.adnV2.AdnV2.dto.ProfileResponse;
import com.swp.adnV2.AdnV2.entity.Users;
import com.swp.adnV2.AdnV2.repository.UserRepository;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

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
        profileResponse.setAvatar(users.getAvatar());
        return ResponseEntity.ok(profileResponse);
    }

    public ResponseEntity<?> updateUsers(String username, ProfileRequest profileRequest) {
        Users users = userRepository.findByUsername(username);
        if (users == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        if (profileRequest.getEmail() != null && !profileRequest.getEmail().isEmpty()
                && !profileRequest.getEmail().equals(users.getEmail())) {
            Users existingUsers = userRepository.findByEmail(profileRequest.getEmail());
            if (existingUsers != null) {
                return ResponseEntity.badRequest().body("Email already exists");
            }
            users.setEmail(profileRequest.getEmail());
        }

        if (profileRequest.getFullName() != null && !profileRequest.getFullName().isEmpty()) {
            users.setFullName(profileRequest.getFullName());
        }
        if (profileRequest.getAddress() != null && !profileRequest.getAddress().isEmpty()) {
            users.setAddress(profileRequest.getAddress());
        }
        if (profileRequest.getDateOfBirth() != null) {
            users.setDateOfBirth(profileRequest.getDateOfBirth());
        }
        if (profileRequest.getGender() != null && !profileRequest.getGender().isEmpty()) {
            users.setGender(profileRequest.getGender());
        }
        if (profileRequest.getPhoneNumber() != null && !profileRequest.getPhoneNumber().isEmpty()) {
            users.setPhone(profileRequest.getPhoneNumber());
        }
        if (profileRequest.getEmail() != null && !profileRequest.getEmail().isEmpty()) {
            users.setEmail(profileRequest.getEmail());
        }
        if(profileRequest.getAvatar() != null && !profileRequest.getAvatar().isEmpty()) {
            users.setAvatar(profileRequest.getAvatar());
        }
        userRepository.save(users);
        return ResponseEntity.ok("Profile updated successfully");
    }
}
