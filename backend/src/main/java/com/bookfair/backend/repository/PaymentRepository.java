package com.bookfair.backend.repository;

import com.bookfair.backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByReservationId(Long id);
    Optional<Payment> findByReservationUserId(Long id);
}
