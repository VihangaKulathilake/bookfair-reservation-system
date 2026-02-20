package com.bookfair.backend.repository;

import com.bookfair.backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT p FROM Payment p LEFT JOIN FETCH p.reservation r LEFT JOIN FETCH r.user u LEFT JOIN FETCH r.stalls s")
    java.util.List<Payment> findAll();

    Optional<Payment> findByReservationId(Long id);

    @org.springframework.data.jpa.repository.Query("SELECT p FROM Payment p LEFT JOIN FETCH p.reservation r LEFT JOIN FETCH r.user u LEFT JOIN FETCH r.stalls s WHERE r.user.id = :userId")
    java.util.List<Payment> findByReservationUserId(@org.springframework.data.repository.query.Param("userId") Long userId);
}
