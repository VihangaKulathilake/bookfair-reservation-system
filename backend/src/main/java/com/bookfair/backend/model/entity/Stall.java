package com.bookfair.backend.model.entity;

<<<<<<< Updated upstream:backend/src/main/java/com/bookfair/backend/model/Stall.java
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
=======
import com.bookfair.backend.model.enums.StallSize;
import com.bookfair.backend.model.enums.StallStatus;
import jakarta.persistence.*;
import lombok.*;
>>>>>>> Stashed changes:backend/src/main/java/com/bookfair/backend/model/entity/Stall.java

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Stall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String type;

<<<<<<< Updated upstream:backend/src/main/java/com/bookfair/backend/model/Stall.java
    private Double price;

    @Column(nullable = false)
    private double price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StallStatus stallStatus;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;
>>>>>>> Stashed changes:backend/src/main/java/com/bookfair/backend/model/entity/Stall.java
}
