package com.bookfair.backend.dto;

import com.bookfair.backend.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private Long reservationId;
    private PaymentMethod paymentMethod;
    private String referenceId;
}
