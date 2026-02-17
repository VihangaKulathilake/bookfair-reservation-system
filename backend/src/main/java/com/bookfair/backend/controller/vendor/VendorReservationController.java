package com.bookfair.backend.controller.vendor;

import com.bookfair.backend.dto.reservation.CreateReservationRequest;
import com.bookfair.backend.dto.reservation.ReservationResponse;
import com.bookfair.backend.model.entity.Reservation;
import com.bookfair.backend.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vendor/reservations")
@RequiredArgsConstructor
public class VendorReservationController {

    private final ReservationService reservationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Reservation> createReservation(@RequestBody CreateReservationRequest request,
            @RequestParam String email) {
        return ResponseEntity.ok(reservationService.createReservation(request, email));
    }

    @GetMapping("/my-reservations")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(@RequestParam String email) {
        return ResponseEntity.ok(reservationService.getMyReservations(email));
    }
}
