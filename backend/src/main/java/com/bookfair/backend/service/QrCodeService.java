package com.bookfair.backend.service;

import com.bookfair.backend.dto.ReservationResponse;
import com.bookfair.backend.model.Reservation;

public interface QrCodeService {

    void processPaymentSuccess(Reservation reservation);

    byte[] generateQrCode(String text, int width, int height);

    ReservationResponse verifyToken(String token);
}
