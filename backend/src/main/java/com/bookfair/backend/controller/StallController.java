package com.bookfair.backend.controller;

import com.bookfair.backend.dto.StallRequest;
import com.bookfair.backend.dto.StallResponse;
import com.bookfair.backend.enums.StallSize;
import com.bookfair.backend.service.StallService;
import com.bookfair.backend.util.ApiEndpoints;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiEndpoints.STALL_BASE)
@RequiredArgsConstructor
public class StallController {
    private final StallService stallService;

    @PostMapping(ApiEndpoints.CREATE_STALL)
    public StallResponse createStall(@RequestBody StallRequest stallRequest) {
        return stallService.createStall(stallRequest);
    }

    @GetMapping(ApiEndpoints.GET_STALL_BY_ID)
    public StallResponse getStallById(@PathVariable Long stallId) {
        return stallService.getStallById(stallId);
    }

    @GetMapping(ApiEndpoints.GET_ALL_STALLS)
    public List<StallResponse> getAllStalls() {
        return stallService.getAllStalls();
    }

    @GetMapping(ApiEndpoints.GET_AVAILABLE_STALLS)
    public List<StallResponse> getAvailableStalls() {
        return stallService.getAvailableStalls();
    }

    @GetMapping(ApiEndpoints.GET_STALLS_BY_SIZE)
    public List<StallResponse> getStallsBySize(@PathVariable StallSize stallSize) {
        return stallService.getStallsBySize(stallSize);
    }

    @PutMapping("/update/{id}")
    public StallResponse updateStall(@PathVariable Long id, @RequestBody StallRequest stallRequest) {
        return stallService.updateStall(id, stallRequest);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteStall(@PathVariable Long id) {
        stallService.deleteStall(id);
    }
}
