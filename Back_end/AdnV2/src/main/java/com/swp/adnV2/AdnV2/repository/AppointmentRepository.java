package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.Appointment;
import com.swp.adnV2.AdnV2.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    // Tìm theo user_id
    List<Appointment> findByUser_UserId(Long userId);

    // Tìm theo username
    List<Appointment> findByUser_Username(String username);

    // Tìm theo username và status
    List<Appointment> findByUser_UsernameAndStatus(String username, String status);

    // Tìm theo email và phone cho người không có tài khoản
    List<Appointment> findByEmailAndPhone(String email, String phone);


}
