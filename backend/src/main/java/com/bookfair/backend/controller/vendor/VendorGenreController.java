package com.bookfair.backend.controller.vendor;

import com.bookfair.backend.dto.genre.AddGenresRequest;
import com.bookfair.backend.dto.genre.GenreResponse;
import com.bookfair.backend.dto.genre.UpdateGenreRequest;
import com.bookfair.backend.service.GenreService;
import com.bookfair.backend.util.CommonMessages;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vendor/genres")
@RequiredArgsConstructor
public class VendorGenreController {

    private final GenreService genreService;

    @GetMapping
    public ResponseEntity<List<GenreResponse>> getAllGenres(@RequestParam(required = false) String email) {
        if (email == null) {
            throw new RuntimeException(CommonMessages.EMAIL_REQUIRED);
        }
        return ResponseEntity.ok(genreService.getGenresByEmail(email));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Void> addGenres(@RequestBody AddGenresRequest request, @RequestParam String email) {
        genreService.addGenres(request, email);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<GenreResponse> updateGenre(@PathVariable Long id, @RequestBody UpdateGenreRequest request) {
        return ResponseEntity.ok(genreService.updateGenre(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGenre(@PathVariable Long id) {
        genreService.deleteGenre(id);
        return ResponseEntity.noContent().build();
    }
}
