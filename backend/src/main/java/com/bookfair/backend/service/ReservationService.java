package com.bookfair.backend.service;

import com.bookfair.backend.dto.ReservationRequest;
import com.bookfair.backend.dto.ReservationResponse;

import java.util.List;

public interface ReservationService {
    ReservationResponse createReservation(ReservationRequest reservationRequest);
    List<ReservationResponse> getAllReservations();
    List<ReservationResponse> getReservationByUserId(Long userId);
    ReservationResponse cancelReservation(Long reservationId);
}
