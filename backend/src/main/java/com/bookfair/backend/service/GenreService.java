package com.bookfair.backend.service;

import com.bookfair.backend.dto.genre.AddGenresRequest;
import com.bookfair.backend.dto.genre.GenreResponse;
import com.bookfair.backend.dto.genre.UpdateGenreRequest;

import java.util.List;

public interface GenreService {
    List<GenreResponse> getGenresByEmail(String email);

    void addGenres(AddGenresRequest request, String email);

    GenreResponse updateGenre(Long id, UpdateGenreRequest request);

    void deleteGenre(Long id);
}
