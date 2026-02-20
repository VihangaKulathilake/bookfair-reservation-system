package com.bookfair.backend.service.impl.payment.paypal;

import com.bookfair.backend.dto.PayPalOrderResponse;
import com.bookfair.backend.service.payment.paypal.PayPalService;
import com.paypal.http.HttpResponse;
import com.paypal.orders.*;
import com.paypal.core.PayPalHttpClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class PayPalServiceImpl implements PayPalService {

    private final PayPalHttpClient payPalHttpClient;

    @Override
    public PayPalOrderResponse createOrder(Double amount, Long reservationId) {
        OrderRequest orderRequest = new OrderRequest();
        orderRequest.checkoutPaymentIntent("CAPTURE");

        java.util.List<PurchaseUnitRequest> purchaseUnits = new java.util.ArrayList<>();
        purchaseUnits.add(new PurchaseUnitRequest().amountWithBreakdown(new AmountWithBreakdown().currencyCode("USD").value(String.format("%.2f", amount))));
        orderRequest.purchaseUnits(purchaseUnits);
        
        // Redirect URLs with Reservation ID
        ApplicationContext applicationContext = new ApplicationContext()
                .returnUrl("http://localhost:5173/payment/success?reservationId=" + reservationId)
                .cancelUrl("http://localhost:5173/payment/cancel");
        orderRequest.applicationContext(applicationContext);

        OrdersCreateRequest request = new OrdersCreateRequest().requestBody(orderRequest);

        try {
            HttpResponse<Order> response = payPalHttpClient.execute(request);
            Order order = response.result();

            String approvalLink = order.links().stream()
                    .filter(link -> "approve".equals(link.rel()))
                    .findFirst()
                    .map(LinkDescription::href)
                    .orElseThrow(() -> new RuntimeException("Approval link not found"));

            return PayPalOrderResponse.builder()
                    .orderId(order.id())
                    .approvalLink(approvalLink)
                    .build();
        } catch (java.io.IOException e) {
            throw new RuntimeException("Failed to create PayPal order", e);
        }
    }

    @Override
    public boolean captureOrder(String orderId) {
        OrdersCaptureRequest request = new OrdersCaptureRequest(orderId);
        // Do not send an empty body if not required by the SDK version, 
        // but if it is, ensure it's valid. The SDK usually handles this.

        try {
            HttpResponse<Order> response = payPalHttpClient.execute(request);
            Order order = response.result();
            return "COMPLETED".equals(order.status());
        } catch (java.io.IOException e) {
            // Check if it's an HttpException from PayPal SDK
            if (e.getMessage().contains("ORDER_ALREADY_CAPTURED") || e.getMessage().contains("status 422")) {
                // If already captured, we try to fetch the order to verify status
                return verifyOrderStatus(orderId);
            }
            throw new RuntimeException("Failed to capture PayPal order: " + e.getMessage(), e);
        }
    }

    private boolean verifyOrderStatus(String orderId) {
        try {
            OrdersGetRequest request = new OrdersGetRequest(orderId);
            HttpResponse<Order> response = payPalHttpClient.execute(request);
            Order order = response.result();
            return "COMPLETED".equals(order.status()) || "APPROVED".equals(order.status());
        } catch (java.io.IOException e) {
            return false;
        }
    }
}
