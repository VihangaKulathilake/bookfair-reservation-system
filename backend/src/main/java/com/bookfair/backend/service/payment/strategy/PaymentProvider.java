package com.bookfair.backend.service.payment.strategy;

import com.bookfair.backend.dto.PaymentResponse;
import com.bookfair.backend.enums.PaymentMethod;

public interface PaymentProvider {

    PaymentMethod getSupportedMethod();

    Object initiatePayment(Long reservationId);

    PaymentResponse confirmPayment(String orderId, Long reservationId);
}

