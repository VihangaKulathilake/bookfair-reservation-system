package com.bookfair.backend.model;

import com.bookfair.backend.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reservationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stall_id")
    private Stall stall;

    private LocalDateTime reservationDate;

    // Status: PENDING, CONFIRMED, CANCELLED
    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    @PrePersist
    public void prePersist() {
        if (status == null) {
            status = ReservationStatus.PENDING;
        }
    }
}
