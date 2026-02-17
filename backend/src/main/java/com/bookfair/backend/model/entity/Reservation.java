package com.bookfair.backend.model.entity;

import com.bookfair.backend.model.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stall_id")
    private Stall stall;

    private Double totalAmount;

    private LocalDateTime reservationDate;

    // Status: PENDING, CONFIRMED, CANCELLED
    private String status;

    @PrePersist
    public void prePersist() {
        if (status == null) {
            status = ReservationStatus.PENDING.name();
        }
    }
}
