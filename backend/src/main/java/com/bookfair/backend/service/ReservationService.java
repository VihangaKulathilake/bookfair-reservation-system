package com.bookfair.backend.service;

import com.bookfair.backend.dto.reservation.ConfirmReservationRequest;
import com.bookfair.backend.dto.reservation.CreateReservationRequest;
import com.bookfair.backend.dto.reservation.UpdateReservationRequest;
import com.bookfair.backend.dto.reservation.ReservationResponse;
import com.bookfair.backend.model.entity.Reservation;

import java.util.List;

public interface ReservationService {
    Reservation createReservation(CreateReservationRequest request, String userEmail);

    List<ReservationResponse> getMyReservations(String userEmail);

    List<ReservationResponse> getAllReservations();

    ReservationResponse getReservationById(Long id);

    Reservation confirmReservation(ConfirmReservationRequest request);

    boolean deleteReservation(Long id);

    Reservation updateReservation(Long id, UpdateReservationRequest request);
}
