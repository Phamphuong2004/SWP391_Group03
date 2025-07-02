package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface FeedbackReppsitory extends JpaRepository<Feedback, Long> {
    @Query("SELECT f FROM Feedback f JOIN f.service s WHERE s.serviceName = :serviceName")
    List<Feedback> findByServiceName(@Param("serviceName") String serviceName);

    @Query("SELECT f FROM Feedback f JOIN f.users u WHERE " +
            "LOWER(f.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Feedback> findByKeyword(@Param("keyword") String keyword);

    @Query("SELECT f FROM Feedback f JOIN f.service s JOIN f.users u WHERE " +
            "s.serviceName = :serviceName AND " +
            "(LOWER(f.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Feedback> findByServiceNameAndKeyword(
            @Param("serviceName") String serviceName,
            @Param("keyword") String keyword
    );
}
