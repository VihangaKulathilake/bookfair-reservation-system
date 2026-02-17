package com.bookfair.backend.service.impl;

import com.bookfair.backend.dto.genre.AddGenresRequest;
import com.bookfair.backend.dto.genre.GenreResponse;
import com.bookfair.backend.dto.genre.UpdateGenreRequest;
import com.bookfair.backend.model.entity.Genre;
import com.bookfair.backend.repository.GenreRepository;
import com.bookfair.backend.service.GenreService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GenreServiceImpl implements GenreService {

    private final GenreRepository genreRepository;
    private final com.bookfair.backend.repository.UserRepository userRepository;

    @Override
    public List<GenreResponse> getGenresByEmail(String email) {
        com.bookfair.backend.model.entity.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return genreRepository.findByUserId(user.getId()).stream()
                .map(genre -> GenreResponse.builder()
                        .id(genre.getId())
                        .name(genre.getName())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public void addGenres(AddGenresRequest request, String email) {
        com.bookfair.backend.model.entity.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Genre> genres = request.getGenreNames().stream()
                .map(name -> new Genre(null, name, user))
                .collect(Collectors.toList());
        genreRepository.saveAll(genres);
    }

    @Override
    public GenreResponse updateGenre(Long id, UpdateGenreRequest request) {
        Genre genre = genreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Genre not found"));

        genre.setName(request.getName());
        Genre updatedGenre = genreRepository.save(genre);

        return GenreResponse.builder()
                .id(updatedGenre.getId())
                .name(updatedGenre.getName())
                .build();
    }

    @Override
    public void deleteGenre(Long id) {
        if (!genreRepository.existsById(id)) {
            throw new RuntimeException("Genre not found");
        }
        genreRepository.deleteById(id);
    }
}
