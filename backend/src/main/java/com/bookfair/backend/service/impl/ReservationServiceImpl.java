package com.bookfair.backend.service.impl;

import com.bookfair.backend.dto.ReservationRequest;
import com.bookfair.backend.dto.ReservationResponse;
import com.bookfair.backend.repository.ReservationRepository;
import com.bookfair.backend.repository.UserRepository;
import com.bookfair.backend.service.ReservationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationServiceImpl implements ReservationService {

    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;

    @Override
    public ReservationResponse createReservation(ReservationRequest reservationRequest) {
        return null;
    }

    @Override
    public List<ReservationResponse> getAllReservations() {
        return List.of();
    }

    @Override
    public List<ReservationResponse> getReservationByUserId(Long userId) {
        return List.of();
    }

    @Override
    public ReservationResponse cancelReservation(Long reservationId) {
        return null;
    }
}
