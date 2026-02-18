package com.bookfair.backend.repository;

import com.bookfair.backend.model.QrPass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QrPassRepository extends JpaRepository<QrPass, Long> {
    Optional<QrPass> findByReservationId(Long reservationId);

    Optional<QrPass> findByToken(String token);
}
