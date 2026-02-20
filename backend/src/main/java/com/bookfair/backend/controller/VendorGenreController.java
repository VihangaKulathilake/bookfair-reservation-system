package com.bookfair.backend.controller;

import com.bookfair.backend.dto.GenreRequest;
import com.bookfair.backend.dto.GenreResponse;
import com.bookfair.backend.service.GenreService;
import com.bookfair.backend.util.ApiEndpoints;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiEndpoints.GENRE_BASE)
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class VendorGenreController {

    private final GenreService genreService;

    @PostMapping
    public ResponseEntity<GenreResponse> createGenre(@RequestBody GenreRequest genreRequest) {
        return ResponseEntity.ok(genreService.createGenre(genreRequest));
    }

    @GetMapping
    public ResponseEntity<List<GenreResponse>> getMyGenres(@RequestParam String vendorEmail) {
        return ResponseEntity.ok(genreService.getGenresByVendor(vendorEmail));
    }

    @PutMapping(ApiEndpoints.UPDATE_GENRE)
    public ResponseEntity<GenreResponse> updateGenre(@PathVariable Long id, @RequestBody GenreRequest genreRequest) {
        return ResponseEntity.ok(genreService.updateGenre(id, genreRequest));
    }

    @DeleteMapping(ApiEndpoints.DELETE_GENRE)
    public ResponseEntity<Void> deleteGenre(@PathVariable Long id) {
        genreService.deleteGenre(id);
        return ResponseEntity.noContent().build();
    }
}
