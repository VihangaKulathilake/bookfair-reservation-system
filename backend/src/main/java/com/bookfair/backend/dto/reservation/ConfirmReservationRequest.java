package com.bookfair.backend.dto.reservation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ConfirmReservationRequest {
    private Long reservationId;
    private boolean confirmed;
}
