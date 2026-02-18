package com.bookfair.backend.service;

import com.bookfair.backend.dto.GenreRequest;
import com.bookfair.backend.dto.GenreResponse;

import java.util.List;

public interface GenreService {
    GenreResponse createGenre(GenreRequest genreRequest);

    GenreResponse updateGenre(Long id, GenreRequest genreRequest);

    void deleteGenre(Long id);

    List<GenreResponse> getGenresByVendor(String vendorEmail);
}
