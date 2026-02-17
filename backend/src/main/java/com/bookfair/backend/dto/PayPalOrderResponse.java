package com.bookfair.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PayPalOrderResponse {
    private String orderId;
    private String approvalLink;
}

