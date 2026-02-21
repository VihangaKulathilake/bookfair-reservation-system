package com.bookfair.backend.dto;

import com.bookfair.backend.enums.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class ReservationResponse {
    private Long reservationId;
    private Long userId;
    private List<String> stallCodes;
    private Double totalAmount;
    private LocalDateTime reservationDate;
    private ReservationStatus reservationStatus;
    private String businessName;
    private String contactNumber;
    private String email;
}
