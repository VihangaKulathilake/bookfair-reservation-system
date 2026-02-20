package com.bookfair.backend.service.payment;

import com.bookfair.backend.dto.PaymentRequest;
import com.bookfair.backend.dto.PaymentResponse;
import com.bookfair.backend.enums.PaymentMethod;

import java.util.List;

public interface PaymentService {
    Object processPayment(PaymentRequest paymentRequest);
    List<PaymentResponse> getPaymentsByUserId(Long id);
    PaymentResponse confirmCashPayment(Long id);
    PaymentResponse confirmPayment(String referenceId, PaymentMethod paymentMethod, Long reservationId);
    PaymentResponse getPaymentById(Long id);
    List<PaymentResponse> getAllPayments();
    PaymentResponse updatePayment(Long id, PaymentRequest paymentRequest);
    void deletePayment(Long id);
}
