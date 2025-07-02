package com.swp.adnV2.AdnV2.repository;

import com.swp.adnV2.AdnV2.entity.Guest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestRepository extends JpaRepository<Guest, Long> {
}
