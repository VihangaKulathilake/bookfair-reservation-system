package com.bookfair.backend.dto.reservation;

import com.bookfair.backend.model.enums.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateReservationRequest {
    private Long stallId;
    private LocalDateTime reservationDate;
    private ReservationStatus status;
}
