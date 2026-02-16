package com.bookfair.backend.service.impl;

import com.bookfair.backend.dto.StallRequest;
import com.bookfair.backend.dto.StallResponse;
import com.bookfair.backend.enums.StallSize;
import com.bookfair.backend.enums.StallStatus;
import com.bookfair.backend.model.Stall;
import com.bookfair.backend.repository.StallRepository;
import com.bookfair.backend.service.StallService;
import com.bookfair.backend.util.CommonMessages;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StallServiceImpl implements StallService {

    private final StallRepository stallRepository;
    @Override
    public StallResponse createStall(StallRequest stallRequest) {
        if (stallRepository.existsByStallCode(stallRequest.getStallCode())) {
            throw new RuntimeException(CommonMessages.STALL_CODE_ALREADY_EXISTS);
        }

        Stall stall = new Stall();
        stall.setStallCode(stallRequest.getStallCode());
        stall.setStallSize(stallRequest.getStallSize());
        stall.setPrice(stallRequest.getPrice());
        stall.setStallStatus(StallStatus.AVAILABLE);

        Stall savedStall = stallRepository.save(stall);
        return mapToResponse(savedStall);
    }

    @Override
    public StallResponse getStallById(Long stallId) {
        Stall stall = stallRepository.findById(stallId)
                .orElseThrow(() -> new RuntimeException(CommonMessages.STALL_NOT_FOUND));
        return mapToResponse(stall);
    }

    @Override
    public List<StallResponse> getAllStalls() {
        return stallRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<StallResponse> getAvailableStalls() {
        return stallRepository.findByStallStatus(StallStatus.AVAILABLE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<StallResponse> getStallsBySize(StallSize stallSize) {
        return stallRepository.findByStallSize(stallSize)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private StallResponse mapToResponse(Stall stall) {
        return StallResponse.builder()
                .stallId(stall.getId())
                .stallCode(stall.getStallCode())
                .stallSize(stall.getStallSize())
                .price(stall.getPrice())
                .stallStatus(stall.getStallStatus())
                .build();
    }
}
