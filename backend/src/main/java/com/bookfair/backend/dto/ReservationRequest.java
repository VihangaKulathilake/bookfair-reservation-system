package com.bookfair.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReservationRequest {
    private Long userId;
    private Long stallId;
}
