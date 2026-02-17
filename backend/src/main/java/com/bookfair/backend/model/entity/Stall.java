package com.bookfair.backend.model.entity;

import com.bookfair.backend.model.enums.StallSize;
import com.bookfair.backend.model.enums.StallStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "stalls")
public class Stall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String stallCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StallSize stallSize;

    @Column(nullable = false)
    private double price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StallStatus stallStatus;

    @Column(nullable = false)
    private String name;
}
