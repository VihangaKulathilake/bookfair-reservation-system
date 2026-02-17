package com.bookfair.backend.repository;

import com.bookfair.backend.model.entity.UserGenre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserGenreRepository extends JpaRepository<UserGenre, Long> {
    List<UserGenre> findByUserId(Long userId);

    List<UserGenre> findByGenreId(Long genreId);
}
