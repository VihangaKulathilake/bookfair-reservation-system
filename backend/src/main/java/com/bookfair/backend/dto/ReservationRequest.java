package com.bookfair.backend.dto;

import com.bookfair.backend.enums.ReservationStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReservationRequest {
    private Long userId;
    private List<Long> stallIds;
    private Double totalAmount;
    private ReservationStatus reservationStatus;
}
