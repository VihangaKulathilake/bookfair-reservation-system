package com.bookfair.backend.service.impl;

import com.bookfair.backend.dto.stall.StallResponse;
import com.bookfair.backend.dto.stall.UpdateStallRequest;
import com.bookfair.backend.model.enums.StallSize;
import com.bookfair.backend.model.entity.Reservation;
import com.bookfair.backend.model.entity.Stall;
import com.bookfair.backend.repository.ReservationRepository;
import com.bookfair.backend.repository.StallRepository;
import com.bookfair.backend.service.StallService;
import com.bookfair.backend.util.CommonMessages;
import com.bookfair.backend.model.enums.StallStatus;
import lombok.RequiredArgsConstructor;
import com.bookfair.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StallServiceImpl implements StallService {

    private final StallRepository stallRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    @Override
    public Stall createStall(Stall stall) {
        return stallRepository.save(stall);
    }

    @Override
    public Stall updateStall(Long id, UpdateStallRequest updateStallRequest) {
        Stall stall = stallRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(CommonMessages.STALL_NOT_FOUND));
        stall.setName(updateStallRequest.getStallCode());
        stall.setStallCode(updateStallRequest.getStallCode());
        stall.setStallSize(updateStallRequest.getStallSize());
        stall.setPrice(updateStallRequest.getPrice());
        stall.setStallStatus(updateStallRequest.getStallStatus());
        return stallRepository.save(stall);
    }

    @Override
    public void deleteStall(Long id) {
        stallRepository.deleteById(id);
    }

    @Override
    public List<StallResponse> getAllStalls() {
        return stallRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public StallResponse getStallById(Long id) {
        Stall stall = stallRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(CommonMessages.STALL_NOT_FOUND));
        return mapToResponse(stall);
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

    @Override
    public List<StallResponse> getStallsByVendorEmail(String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(CommonMessages.USER_NOT_FOUND));

        return reservationRepository.findByUserId(user.getId()).stream()
                .map(Reservation::getStall)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}
