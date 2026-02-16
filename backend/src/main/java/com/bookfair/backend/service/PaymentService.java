package com.bookfair.backend.service;

import com.bookfair.backend.dto.PaymentRequest;
import com.bookfair.backend.dto.PaymentResponse;

import java.util.List;

public interface PaymentService {
    PaymentResponse processPayment(PaymentRequest paymentRequest);
    List<PaymentResponse> getPaymentsByUserId(Long id);
    PaymentResponse confirmCashPayment(Long id);
    PaymentResponse getPaymentById(Long id);
    List<PaymentResponse> getAllPayments();
}
