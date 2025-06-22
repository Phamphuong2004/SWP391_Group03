package com.swp.adnV2.AdnV2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.swp.adnV2.AdnV2.entity.Result;


@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    // Define any custom query methods if needed
    // For example, you might want to find results by user or test
    // Optional<Result> findByUserIdAndTestId(Long userId, Long testId);
}
