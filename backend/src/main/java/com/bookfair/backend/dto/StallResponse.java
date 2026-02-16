package com.bookfair.backend.dto;

import com.bookfair.backend.enums.StallSize;
import com.bookfair.backend.enums.StallStatus;
import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@AllArgsConstructor
public class StallResponse {
    private Long stallId;
    private String stallCode;
    private StallSize stallSize;
    private double price;
    private StallStatus stallStatus;
}
