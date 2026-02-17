package com.bookfair.backend.controller.admin;

import com.bookfair.backend.model.entity.Stall;
import com.bookfair.backend.dto.stall.StallResponse;
import com.bookfair.backend.dto.stall.UpdateStallRequest;
import com.bookfair.backend.service.StallService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/stalls")
@RequiredArgsConstructor
public class AdminStallController {

    private final StallService stallService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Stall> createStall(@RequestBody Stall stall) {
        return ResponseEntity.ok(stallService.createStall(stall));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<Stall> updateStall(@PathVariable Long id, @RequestBody UpdateStallRequest request) {
        return ResponseEntity.ok(stallService.updateStall(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<Void> deleteStall(@PathVariable Long id) {
        stallService.deleteStall(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<StallResponse>> getAllStalls() {
        return ResponseEntity.ok(stallService.getAllStalls());
    }
}
