package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.SampleType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SampleTypeRepository extends JpaRepository<SampleType, Long> {
    SampleType findByName(String name);
}
