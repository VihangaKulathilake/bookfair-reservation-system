package com.bookfair.backend.service.impl;

import com.bookfair.backend.dto.PaymentRequest;
import com.bookfair.backend.dto.PaymentResponse;
import com.bookfair.backend.model.enums.PaymentMethod;
import com.bookfair.backend.model.enums.PaymentStatus;
import com.bookfair.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    @Override
    public PaymentResponse processPayment(PaymentRequest paymentRequest) {
        // TODO: Implement actual payment processing logic
        return new PaymentResponse(
                1L,
                150.0, // Mock amount
                PaymentMethod.CASH,
                PaymentStatus.SUCCESS,
                LocalDateTime.now());
    }

    @Override
    public List<PaymentResponse> getPaymentsByUserId(Long id) {
        // TODO: Implement logic to fetch payments by user ID
        return Collections.emptyList();
    }

    @Override
    public PaymentResponse confirmCashPayment(Long id) {
        // TODO: Implement logic to confirm cash payment
        return new PaymentResponse(
                id,
                0.0,
                PaymentMethod.CASH,
                PaymentStatus.SUCCESS,
                LocalDateTime.now());
    }

    @Override
    public PaymentResponse getPaymentById(Long id) {
        // TODO: Implement logic to fetch payment by ID
        return new PaymentResponse(
                id,
                0.0,
                PaymentMethod.CASH,
                PaymentStatus.PENDING,
                LocalDateTime.now());
    }

    @Override
    public List<PaymentResponse> getAllPayments() {
        // TODO: Implement logic to fetch all payments
        return Collections.emptyList();
    }
}
