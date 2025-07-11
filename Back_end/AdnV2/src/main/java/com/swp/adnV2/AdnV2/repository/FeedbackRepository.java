package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}
