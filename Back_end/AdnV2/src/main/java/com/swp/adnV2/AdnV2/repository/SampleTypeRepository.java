package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.SampleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SampleTypeRepository extends JpaRepository<SampleType, Long> {
    Optional<SampleType> findByName(String name);
    boolean existsByName(String sampleTypeName);
    List<SampleType> findByKitComponent_ComponentName(String componentName);

    Optional<SampleType> findByNameAndKitComponent_ComponentName(String name, String kitComponentComponentName);
}
