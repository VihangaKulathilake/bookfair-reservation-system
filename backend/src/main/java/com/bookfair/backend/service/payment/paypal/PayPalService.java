package com.bookfair.backend.service.payment.paypal;

import com.bookfair.backend.dto.PayPalOrderResponse;

public interface PayPalService {

    PayPalOrderResponse createOrder(Double amount, Long reservationId);

    boolean captureOrder(String orderId);
}

