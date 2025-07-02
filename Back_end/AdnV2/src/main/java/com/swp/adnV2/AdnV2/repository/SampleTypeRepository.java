package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.SampleType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SampleTypeRepository extends JpaRepository<SampleType, Long> {
    Optional<SampleType> findByName(String name);
}
