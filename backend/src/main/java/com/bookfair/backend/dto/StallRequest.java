package com.bookfair.backend.dto;

import com.bookfair.backend.enums.StallSize;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StallRequest {
    private String stallCode;
    private StallSize stallSize;
    private double price;
}
