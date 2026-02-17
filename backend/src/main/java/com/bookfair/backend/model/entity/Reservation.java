package com.bookfair.backend.model.entity;

<<<<<<< Updated upstream:backend/src/main/java/com/bookfair/backend/model/Reservation.java
=======
import com.bookfair.backend.model.enums.ReservationStatus;
>>>>>>> Stashed changes:backend/src/main/java/com/bookfair/backend/model/entity/Reservation.java
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

<<<<<<< Updated upstream:backend/src/main/java/com/bookfair/backend/model/Reservation.java
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stall_id")
    private Stall stall;

    private LocalDateTime reservationDate;

    // Status: PENDING, CONFIRMED, CANCELLED
    private String status;
=======
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stall_id")
    private Stall stall;

    private Double totalAmount;

    private LocalDateTime reservationDate;

    @Column(name = "status")
    private String status;

    @PrePersist
    public void prePersist() {
        if (status == null) {
            status = ReservationStatus.PENDING.name();
        }
    }
>>>>>>> Stashed changes:backend/src/main/java/com/bookfair/backend/model/entity/Reservation.java
}
