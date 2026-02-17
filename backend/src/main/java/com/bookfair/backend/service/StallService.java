package com.bookfair.backend.service;

import com.bookfair.backend.dto.stall.StallResponse;
import com.bookfair.backend.dto.stall.UpdateStallRequest;
import com.bookfair.backend.model.entity.Stall;

import java.util.List;

public interface StallService {
    Stall createStall(Stall stall);

    Stall updateStall(Long id, UpdateStallRequest updateStallRequest);

    void deleteStall(Long id);

    List<StallResponse> getAllStalls();

    StallResponse getStallById(Long id);

    List<StallResponse> getStallsByVendorEmail(String email);
}
