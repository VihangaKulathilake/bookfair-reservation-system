package com.bookfair.backend.repository;

import com.bookfair.backend.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // Get all reservations for a specific user
    // Get all reservations for a specific user
    @org.springframework.data.jpa.repository.Query("SELECT r FROM Reservation r LEFT JOIN FETCH r.user LEFT JOIN FETCH r.stalls WHERE r.user.id = :id")
    List<Reservation> findByUserId(@org.springframework.data.repository.query.Param("id") Long id);

    @org.springframework.data.jpa.repository.Query("SELECT r FROM Reservation r LEFT JOIN FETCH r.user LEFT JOIN FETCH r.stalls")
    List<Reservation> findAll();

}
