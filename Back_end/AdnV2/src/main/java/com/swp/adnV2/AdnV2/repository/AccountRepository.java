package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface AccountRepository extends JpaRepository<Users, Long> {
    Optional<ManageAccount> findByUsername(String username);
}
