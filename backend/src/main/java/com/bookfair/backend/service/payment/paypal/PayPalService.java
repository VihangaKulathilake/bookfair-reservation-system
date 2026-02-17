package com.bookfair.backend.service.payment.paypal;

import com.bookfair.backend.dto.PayPalOrderResponse;

public interface PayPalService {

    PayPalOrderResponse createOrder(Double amount);

    boolean captureOrder(String orderId);
}

