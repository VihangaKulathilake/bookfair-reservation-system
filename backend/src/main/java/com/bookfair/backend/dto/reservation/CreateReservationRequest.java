package com.bookfair.backend.dto.reservation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateReservationRequest {
    private Long stallId;
    private LocalDateTime reservationDate;
    // User ID is typically extracted from the security context
}
