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
    public List<ReservationResponse> getReservationByUserId(@PathVariable("id") Long userId) {
        return reservationService.getReservationByUserId(userId);
    }

    @PutMapping("/{id}/status")
    public ReservationResponse updateReservationStatus(@PathVariable Long id, @RequestParam String status) {
        return reservationService.updateReservationStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public void deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
    }

    @GetMapping(value = "/{id}/qr", produces = org.springframework.http.MediaType.IMAGE_PNG_VALUE)
    public byte[] generateQrCode(@PathVariable Long id) {
        return reservationService.generateQrCode(id);
    }
}
