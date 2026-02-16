package com.bookfair.backend.service;

import com.bookfair.backend.dto.ReservationRequest;
import com.bookfair.backend.dto.ReservationResponse;

import java.util.List;

public interface ReservationService {
    ReservationResponse createReservation(ReservationRequest reservationRequest);
    List<ReservationResponse> getAllReservations();
    ReservationResponse getReservationById(Long id);
    List<ReservationResponse> getReservationByUserId(Long id);
    ReservationResponse cancelReservation(Long id);
}
