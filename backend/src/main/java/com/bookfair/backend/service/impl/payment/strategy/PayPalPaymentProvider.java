package com.bookfair.backend.service.impl.payment.strategy;

import com.bookfair.backend.dto.PayPalOrderResponse;
import com.bookfair.backend.dto.PaymentResponse;
import com.bookfair.backend.enums.PaymentMethod;
import com.bookfair.backend.enums.PaymentStatus;
import com.bookfair.backend.model.Payment;
import com.bookfair.backend.model.Reservation;
import com.bookfair.backend.repository.PaymentRepository;
import com.bookfair.backend.repository.ReservationRepository;
import com.bookfair.backend.service.payment.paypal.PayPalService;
import com.bookfair.backend.service.payment.strategy.PaymentProvider;
import com.bookfair.backend.util.CommonMessages;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PayPalPaymentProvider implements PaymentProvider {

    private final PayPalService payPalService;
    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;


    @Override
    public PaymentMethod getSupportedMethod() {
        return PaymentMethod.PAYPAL;
    }

    @Override
    public PayPalOrderResponse initiatePayment(Long reservationId) {

        Double amount = getReservationAmount(reservationId);

        return payPalService.createOrder(amount);
    }

    @Override
    public PaymentResponse confirmPayment(String orderId, Long reservationId) {
        // capture the order from PayPal sandbox
        boolean success = payPalService.captureOrder(orderId);

        // fetch reservation
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException(CommonMessages.RESERVATION_NOT_FOUND));

        // save payment in DB
        Payment payment = savePayment(orderId, success, reservation);

        if (success) {
            reservation.setReservationStatus(com.bookfair.backend.enums.ReservationStatus.CONFIRMED);
            reservationRepository.save(reservation);
        }

        return mapToResponse(payment);
    }


    // Get reservation amount
    private Double getReservationAmount(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException(CommonMessages.RESERVATION_NOT_FOUND));

        return reservation.getTotalAmount();
    }

    // save payment in DB
    private Payment savePayment(String orderId, boolean success, Reservation reservation) {
        Payment payment = Payment.builder()
                .amount(reservation.getTotalAmount())
                .transactionId(orderId)
                .paymentMethod(PaymentMethod.PAYPAL)
                .paymentStatus(success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED)
                .paymentDate(LocalDateTime.now())
                .reservation(reservation)
                .build();

        return paymentRepository.save(payment);
    }

    // map Payment entity to response DTO
    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .paymentId(payment.getId())
                .amount(payment.getAmount())
                .transactionId(payment.getTransactionId())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus())
                .paymentDate(payment.getPaymentDate())
                .build();
    }

}
