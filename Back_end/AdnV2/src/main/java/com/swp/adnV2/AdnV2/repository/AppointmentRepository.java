package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.Appointment;
import com.swp.adnV2.AdnV2.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUser_UserId(Long userId);
    List<Appointment> findByUser_Username(String username);

    // Tìm các cuộc hẹn theo email hoặc số điện thoại (cho người dùng không có tài khoản)
    List<Appointment> findByEmailAndPhone(String email, String phone);

}
