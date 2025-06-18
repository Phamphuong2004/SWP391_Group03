package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    // Tìm theo user_id
    List<Appointment> findByUsers_UserId(Long userId);

    // Tìm theo username
    List<Appointment> findByUsers_Username(String username);


    // Tìm theo email và phone cho người không có tài khoản
    List<Appointment> findByEmailAndPhone(String email, String phone);

    List<Appointment> findByUsers_UsernameAndStatus(String username, String status);

}
