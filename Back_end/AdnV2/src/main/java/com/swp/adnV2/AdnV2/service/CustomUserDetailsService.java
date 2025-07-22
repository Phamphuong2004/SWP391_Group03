package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.entity.Users;
import com.swp.adnV2.AdnV2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("Trying to find user with username: " + username);
        Users user = userRepository.findByUsername(username);

        if (user == null) {
            System.out.println("User not found in database: " + username);
            throw new UsernameNotFoundException("Không tìm thấy người dùng có username: " + username);
        }

        System.out.println("Found user: " + username);
        System.out.println("User role in DB: " + user.getRole());

        // Đảm bảo role có tiền tố "ROLE_"
        String roleWithPrefix = user.getRole().startsWith("ROLE_")
            ? user.getRole().toUpperCase()
            : "ROLE_" + user.getRole().toUpperCase();

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(roleWithPrefix);
        System.out.println("Granted authority: " + authority.getAuthority());

        // Trả về UserDetails với thông tin từ database - sử dụng password dạng plain-text
        return User.builder()
            .username(user.getUsername())
            .password(user.getPassword())
            .authorities(Collections.singleton(authority))
            .build();
    }
}
