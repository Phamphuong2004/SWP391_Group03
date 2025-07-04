package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.config.JwtUtil;
import com.swp.adnV2.AdnV2.dto.AuthenticationRequest;
import com.swp.adnV2.AdnV2.dto.AuthenticationResponse;
import com.swp.adnV2.AdnV2.dto.GoogleSignInRequest;
import com.swp.adnV2.AdnV2.entity.Role;
import com.swp.adnV2.AdnV2.entity.Users;
import com.swp.adnV2.AdnV2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) throws Exception {
        System.out.println("Login attempt for username: " + authenticationRequest.getUsername());
        System.out.println("Password provided: " + authenticationRequest.getPassword());

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword())
            );
            System.out.println("Authentication successful");
        } catch (BadCredentialsException e) {
            System.out.println("Authentication failed: " + e.getMessage());
            throw new Exception("Incorrect username or password", e);
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);
        System.out.println("JWT token generated successfully");

        return ResponseEntity.ok(new AuthenticationResponse(jwt));
    }

    @PostMapping("/google-signin")
    public ResponseEntity<?> signInByGoogle(@RequestBody GoogleSignInRequest googleSignInRequest) {
        Map<String, Object> response = new HashMap<>();
        Users users = userRepository.findByEmail(googleSignInRequest.getEmail());
        AuthenticationRequest authenticationRequest = new AuthenticationRequest();
        if (users == null) {
            // Create a new user if not found
            users = new Users();
            users.setFullName(googleSignInRequest.getFullName());
            users.setEmail(googleSignInRequest.getEmail());
            users.setUsername(googleSignInRequest.getEmail());
            users.setRole(Role.CUSTOMER.name());
            userRepository.save(users);
            authenticationRequest.setUsername(users.getUsername());
            authenticationRequest.setPassword(""); // Use email as password for Google sign-in
        }
        authenticationRequest.setUsername(users.getUsername());
        authenticationRequest.setPassword(users.getPassword()); // Use email as password for
        response.put("Exists", true);
        response.put("message", "Login successful");
        response.put("role", users.getRole());
        final String jwt = jwtUtil.generateTokenNew(users.getUsername());
        System.out.println("JWT token generated successfully");

        return ResponseEntity.ok(new AuthenticationResponse(jwt));
    }
}
