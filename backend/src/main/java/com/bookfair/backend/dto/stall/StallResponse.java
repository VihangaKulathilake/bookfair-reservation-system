package com.bookfair.backend.dto.stall;

import com.bookfair.backend.model.enums.StallSize;
import com.bookfair.backend.model.enums.StallStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StallResponse {
    private Long stallId;
    private String stallCode;
    private StallSize stallSize;
    private double price;
    private StallStatus stallStatus;
}
