package com.bookfair.backend.dto.stall;

import com.bookfair.backend.model.enums.StallSize;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateStallRequest {
    private String stallCode;
    private StallSize stallSize;
    private double price;
    private com.bookfair.backend.model.enums.StallStatus stallStatus;
}
