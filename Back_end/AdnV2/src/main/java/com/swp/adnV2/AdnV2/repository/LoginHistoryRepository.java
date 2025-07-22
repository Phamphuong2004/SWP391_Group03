package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.LoginHistory;
import com.swp.adnV2.AdnV2.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long> {
    List<LoginHistory> findByUsersOrderByLoginTimeDesc(Users users);

    boolean existsByUsers_UserId(Long id);
    // Thêm hàm này vào interface
    void deleteByUsers_UserId(Long userId);
}