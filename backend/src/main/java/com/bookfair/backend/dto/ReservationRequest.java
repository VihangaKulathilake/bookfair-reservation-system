package com.bookfair.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReservationRequest {
    private Long userId;
    private List<Long> stallIds;
}
