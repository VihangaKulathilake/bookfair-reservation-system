package com.bookfair.backend.controller;

import com.bookfair.backend.dto.ReservationRequest;
import com.bookfair.backend.dto.ReservationResponse;
import com.bookfair.backend.service.ReservationService;
import com.bookfair.backend.util.ApiEndpoints;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiEndpoints.RESERVATION_BASE)
@RequiredArgsConstructor
public class ReservationController {
    private final ReservationService reservationService;

    @PostMapping(ApiEndpoints.CREATE_RESERVATION)
    public ReservationResponse createReservation(@RequestBody ReservationRequest reservationRequest) {
        return reservationService.createReservation(reservationRequest);
    }

    @PutMapping(ApiEndpoints.CANCEL_RESERVATION)
    public ReservationResponse cancelReservation(@PathVariable Long reservationId) {
        return reservationService.cancelReservation(reservationId);
    }

    @GetMapping(ApiEndpoints.GET_ALL_RESERVATIONS)
    public List<ReservationResponse> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @GetMapping(ApiEndpoints.GET_RESERVATION_BY_ID)
    public ReservationResponse getReservationById(@PathVariable Long reservationId) {
        return reservationService.getReservationById(reservationId);
    }

    @GetMapping(ApiEndpoints.GET_RESERVATION_BY_USER_ID)
    public List<ReservationResponse> getReservationByUserId(@PathVariable Long userId) {
        return reservationService.getReservationByUserId(userId);
    }
}
