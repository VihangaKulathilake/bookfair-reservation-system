package com.bookfair.backend.dto.reservation;

import com.bookfair.backend.model.enums.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReservationResponse {
    private Long id;
    private Long userId;
    private String userName;
    private Long stallId;
    private String stallName;
    private Double totalAmount;
    private LocalDateTime reservationDate;
    private String status;
}
