package com.bookfair.backend.repository;

import com.bookfair.backend.model.Reservation;
import com.bookfair.backend.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // Get all reservations for a specific user
    List<Reservation> findByUserId(Long userId);

    // Get all reservations for a specific stall
    List<Reservation> findByStallId(Long stallId);

    // Get reservations by status
    List<Reservation> findByStatus(ReservationStatus status);

    // Get reservations by user + status
    List<Reservation> findByUserIdAndStatus(Long userId, ReservationStatus status);

}
