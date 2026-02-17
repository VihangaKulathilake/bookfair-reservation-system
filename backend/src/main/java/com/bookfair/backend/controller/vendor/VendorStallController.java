package com.bookfair.backend.controller.vendor;

import com.bookfair.backend.dto.stall.StallResponse;
import com.bookfair.backend.service.StallService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vendor/stalls")
@RequiredArgsConstructor
public class VendorStallController {

    private final StallService stallService;

    @GetMapping
    public ResponseEntity<List<StallResponse>> getAllStalls(@RequestParam(required = false) String email) {
        if (email != null && !email.isEmpty()) {
            return ResponseEntity.ok(stallService.getStallsByVendorEmail(email));
        }
        return ResponseEntity.ok(stallService.getAllStalls());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StallResponse> getStallById(@PathVariable Long id) {
        return ResponseEntity.ok(stallService.getStallById(id));
    }
}
