package com.bookfair.backend.dto;

import com.bookfair.backend.enums.PaymentMethod;
import com.bookfair.backend.enums.PaymentStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class PaymentResponse {
    private Long paymentId;
    private Double amount;
    private String transactionId;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private LocalDateTime paymentDate;
}
