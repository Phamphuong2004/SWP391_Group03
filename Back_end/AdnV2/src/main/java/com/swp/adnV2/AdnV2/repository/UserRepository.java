package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Users, Long> {
    Users findByUsername(String username);
    Users findByEmail(String email);
    Users findByPhone(String phone);
}
