package com.bookfair.backend.dto;

import com.bookfair.backend.enums.ReservationStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReservationResponse {
    private Long id;
    private Long userId;
    private Long stallId;
    private LocalDateTime reservationDate;
    private ReservationStatus status;
}
