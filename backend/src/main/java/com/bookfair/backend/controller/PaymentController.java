package com.bookfair.backend.controller;

import com.bookfair.backend.dto.PaymentRequest;
import com.bookfair.backend.dto.PaymentResponse;
import com.bookfair.backend.service.payment.PaymentService;
import com.bookfair.backend.util.ApiEndpoints;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiEndpoints.PAYMENT_BASE)
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping(ApiEndpoints.PROCESS_PAYMENT)
    public Object processPayment(@RequestBody PaymentRequest paymentRequest) {
        return paymentService.processPayment(paymentRequest);
    }

    @PostMapping(ApiEndpoints.CONFIRM_PAYMENT)
    public PaymentResponse confirmPayment(@RequestBody PaymentRequest paymentRequest) {
        return paymentService.confirmPayment(
                paymentRequest.getReferenceId(),
                paymentRequest.getPaymentMethod(),
                paymentRequest.getReservationId()
        );
    }

    @PutMapping(ApiEndpoints.CONFIRM_CASH_PAYMENT)
    public PaymentResponse confirmCashPayment(@PathVariable Long paymentId) {
        return paymentService.confirmCashPayment(paymentId);
    }

    @GetMapping(ApiEndpoints.GET_PAYMENT_BY_ID)
    public PaymentResponse getPaymentsById(@PathVariable Long paymentId) {
        return paymentService.getPaymentById(paymentId);
    }

    @GetMapping(ApiEndpoints.GET_ALL_PAYMENTS)
    public List<PaymentResponse> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping(ApiEndpoints.GET_PAYMENTS_BY_USER_ID)
    public List<PaymentResponse> getPaymentsByUserId(@PathVariable Long userId) {
        return paymentService.getPaymentsByUserId(userId);
    }

    @PutMapping("/{id}")
    public PaymentResponse updatePayment(@PathVariable Long id, @RequestBody PaymentRequest paymentRequest) {
        return paymentService.updatePayment(id, paymentRequest);
    }

    @DeleteMapping("/{id}")
    public void deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
    }
}
