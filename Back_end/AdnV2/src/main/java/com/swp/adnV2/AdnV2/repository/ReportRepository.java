package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByUsers_UserId(Long userId);
}
