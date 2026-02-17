package com.bookfair.backend.service.impl.payment;

import com.bookfair.backend.dto.PaymentRequest;
import com.bookfair.backend.dto.PaymentResponse;
import com.bookfair.backend.enums.PaymentMethod;
import com.bookfair.backend.enums.PaymentStatus;
import com.bookfair.backend.enums.ReservationStatus;
import com.bookfair.backend.model.Payment;
import com.bookfair.backend.model.Reservation;
import com.bookfair.backend.model.User;
import com.bookfair.backend.repository.PaymentRepository;
import com.bookfair.backend.repository.ReservationRepository;
import com.bookfair.backend.repository.UserRepository;
import com.bookfair.backend.service.payment.PaymentService;
import com.bookfair.backend.service.payment.strategy.PaymentProvider;
import com.bookfair.backend.util.CommonMessages;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final List<PaymentProvider> paymentProviders;

    @Override
    public Object processPayment(PaymentRequest paymentRequest) {
        Reservation reservation = reservationRepository.findById(paymentRequest.getReservationId())
                .orElseThrow(() -> new RuntimeException(CommonMessages.RESERVATION_NOT_FOUND));

        if (paymentRepository.findByReservationId(reservation.getId()).isPresent()) {
            throw new RuntimeException(CommonMessages.PAYMENT_ALREADY_EXISTS);
        }

        // Cash payments
        if (paymentRequest.getPaymentMethod() == PaymentMethod.CASH){
            Payment payment = Payment.builder()
                    .reservation(reservation)
                    .amount(reservation.getTotalAmount())
                    .paymentMethod(paymentRequest.getPaymentMethod())
                    .paymentDate(LocalDateTime.now())
                    .build();

            reservation.setReservationStatus(ReservationStatus.PENDING);

            reservationRepository.save(reservation);
            paymentRepository.save(payment);

            return mapToPaymentResponse(payment);

        }

        // For other methods, delegate to the proper PaymentProvider
        PaymentProvider provider = getProvider(paymentRequest.getPaymentMethod());

        return provider.initiatePayment(reservation.getId());

    }

    // Cash payment confirmation
    @Override
    public PaymentResponse confirmCashPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException(CommonMessages.PAYMENT_NOT_FOUND));

        if (payment.getPaymentMethod() != PaymentMethod.CASH) {
            throw new RuntimeException(CommonMessages.PAYMENT_CONFIRMATION_REQUIRED);
        }

        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.getReservation().setReservationStatus(ReservationStatus.CONFIRMED);

        return mapToPaymentResponse(payment);
    }

    // Confirmation for paying by other methods
    @Override
    public PaymentResponse confirmPayment(String referenceId, PaymentMethod method, Long reservationId) {

        if (method == PaymentMethod.CASH) {
            throw new RuntimeException(CommonMessages.PAYMENT_CONFIRMATION_REQUIRED);
        }

        // Find the correct provider and delegate
        PaymentProvider provider = getProvider(method);

        return provider.confirmPayment(referenceId, reservationId);
    }

    // Getters
    @Override
    public PaymentResponse getPaymentById(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException(CommonMessages.PAYMENT_NOT_FOUND));

        return mapToPaymentResponse(payment);
    }

    @Override
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(this::mapToPaymentResponse)
                .toList();
    }

    @Override
    public List<PaymentResponse> getPaymentsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException(CommonMessages.USER_NOT_FOUND));

        return paymentRepository.findByReservationUserId(user.getId())
                .stream()
                .map(this::mapToPaymentResponse)
                .toList();
    }

    // Helper methods
    private PaymentProvider getProvider(PaymentMethod method) {
        return paymentProviders.stream()
                .filter(provider -> provider.getSupportedMethod() == method)
                .findFirst()
                .orElseThrow(() -> new RuntimeException(CommonMessages.PAYMENT_PROVIDER_NOT_FOUND));
    }
    private PaymentResponse mapToPaymentResponse(Payment payment) {
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
