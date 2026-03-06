package com.bookfair.backend.repository;

import com.bookfair.backend.model.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT g FROM Genre g LEFT JOIN FETCH g.user WHERE g.user.email = :email")
    List<Genre> findAllByUserEmail(String email);

    boolean existsByNameAndUserEmail(String name, String email);

    void deleteByUserId(Long userId);
}
