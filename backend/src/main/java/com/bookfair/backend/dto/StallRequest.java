package com.bookfair.backend.dto;

import com.bookfair.backend.enums.StallSize;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class StallRequest {

    private String stallCode;

    private StallSize stallSize;

    private BigDecimal price;

}
