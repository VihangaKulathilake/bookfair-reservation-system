package com.bookfair.backend.repository;

import com.bookfair.backend.enums.StallSize;
import com.bookfair.backend.enums.StallStatus;
import com.bookfair.backend.model.Stall;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StallRepository extends JpaRepository<Stall, Long> {
    boolean existsByStallCode(String stallCode);
    boolean existsByStallCodeAndIdNot(String stallCode, Long id);
    List<Stall> findByStallStatus(StallStatus stallStatus);
    List<Stall> findByStallSize(StallSize stallSize);
}
