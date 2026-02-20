package com.bookfair.backend.service.impl;

import com.bookfair.backend.dto.GenreRequest;
import com.bookfair.backend.dto.GenreResponse;
import com.bookfair.backend.model.Genre;
import com.bookfair.backend.model.User;
import com.bookfair.backend.repository.GenreRepository;
import com.bookfair.backend.repository.UserRepository;
import com.bookfair.backend.service.GenreService;
import com.bookfair.backend.util.CommonMessages;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GenreServiceImpl implements GenreService {

    private final GenreRepository genreRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public GenreResponse createGenre(GenreRequest genreRequest) {
        User vendor = userRepository.findByEmail(genreRequest.getVendorEmail())
                .orElseThrow(() -> new RuntimeException(CommonMessages.VENDOR_NOT_FOUND));

        if (genreRepository.existsByNameAndUserEmail(genreRequest.getName(), genreRequest.getVendorEmail())) {
            throw new RuntimeException(CommonMessages.GENRE_ALREADY_EXISTS);
        }

        Genre genre = new Genre();
        genre.setName(genreRequest.getName());
        genre.setUser(vendor);

        Genre savedGenre = genreRepository.save(genre);
        return mapToResponse(savedGenre);
    }

    @Override
    @Transactional
    public GenreResponse updateGenre(Long id, GenreRequest genreRequest) {
        Genre genre = genreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(CommonMessages.GENRE_NOT_FOUND));

        if (!genre.getUser().getEmail().equals(genreRequest.getVendorEmail())) {
            throw new RuntimeException(CommonMessages.UNAUTHORIZED_ACCESS);
        }

        if (!genre.getName().equals(genreRequest.getName()) &&
                genreRepository.existsByNameAndUserEmail(genreRequest.getName(), genreRequest.getVendorEmail())) {
            throw new RuntimeException(CommonMessages.GENRE_NAME_ALREADY_EXISTS);
        }

        genre.setName(genreRequest.getName());
        Genre updatedGenre = genreRepository.save(genre);
        return mapToResponse(updatedGenre);
    }

    @Override
    @Transactional
    public void deleteGenre(Long id) {
        if (!genreRepository.existsById(id)) {
            throw new RuntimeException(CommonMessages.GENRE_NOT_FOUND);
        }
        genreRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GenreResponse> getGenresByVendor(String vendorEmail) {
        return genreRepository.findAllByUserEmail(vendorEmail).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private GenreResponse mapToResponse(Genre genre) {
        return new GenreResponse(
                genre.getId(),
                genre.getName(),
                genre.getUser().getEmail());
    }
}
