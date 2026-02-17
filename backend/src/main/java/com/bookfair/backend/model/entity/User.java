package com.bookfair.backend.model.entity;

<<<<<<< Updated upstream:backend/src/main/java/com/bookfair/backend/model/User.java
=======
import com.bookfair.backend.model.enums.Role;
>>>>>>> Stashed changes:backend/src/main/java/com/bookfair/backend/model/entity/User.java
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String businessName;

    @Column(unique = true)
    private String email;

    private String password;

    private String contactNumber;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "user")
    private List<Reservation> reservations;
}
