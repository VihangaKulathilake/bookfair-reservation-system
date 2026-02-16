package com.bookfair.backend.service;

import com.bookfair.backend.dto.StallRequest;
import com.bookfair.backend.dto.StallResponse;
import com.bookfair.backend.enums.StallSize;

import java.util.List;

public interface StallService {
    StallResponse createStall(StallRequest stallRequest);

    StallResponse getStallById(Long id);
    List<StallResponse> getAllStalls();
    List<StallResponse> getAvailableStalls();
    List<StallResponse> getStallsBySize(StallSize stallSize);
}
