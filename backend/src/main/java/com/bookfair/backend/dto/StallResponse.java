package com.bookfair.backend.dto;

import com.bookfair.backend.enums.StallSize;
import com.bookfair.backend.enums.StallStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Builder
@Getter
public class StallResponse {
    private Long stallId;
    private String stallCode;
    private StallSize stallSize;
    private BigDecimal price;
    private StallStatus stallStatus;
}
