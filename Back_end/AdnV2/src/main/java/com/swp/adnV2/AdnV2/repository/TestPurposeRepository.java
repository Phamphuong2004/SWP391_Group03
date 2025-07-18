package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.TestPurpose;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestPurposeRepository extends JpaRepository<TestPurpose, Long> {
    TestPurpose findByTestPurposeName(String name);
}