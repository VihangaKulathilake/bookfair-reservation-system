package com.bookfair.backend.service.impl;

import com.bookfair.backend.dto.ReservationResponse;
import com.bookfair.backend.model.QrPass;
import com.bookfair.backend.model.Reservation;
import com.bookfair.backend.model.Stall;
import com.bookfair.backend.repository.QrPassRepository;
import com.bookfair.backend.service.QrCodeService;
import com.bookfair.backend.util.CommonMessages;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QrCodeServiceImpl implements QrCodeService {

    private final QrPassRepository qrPassRepository;
    private final JavaMailSender javaMailSender;

    @Override
    public void processPaymentSuccess(Reservation reservation) {
        // Check: if QR already exists or do not recreate or resend
        if (qrPassRepository.findByReservationId(reservation.getId()).isPresent()) {
            log.info("QR Pass already exists for reservation ID: {}", reservation.getId());
            return;
        }

        try {
            String token = UUID.randomUUID().toString();

            QrPass qrPass = QrPass.builder()
                    .token(token)
                    .reservation(reservation)
                    .build();
            qrPassRepository.save(qrPass);

            byte[] qrImage = generateQrCode(token, 300, 300);

            sendQrEmail(reservation, qrImage);

            log.info("QR Code generated and email sent for reservation ID: {}", reservation.getId());

        } catch (Exception e) {
            log.error("Error processing payment success for reservation ID: {}", reservation.getId(), e);
        }
    }

    @Override
    public byte[] generateQrCode(String text, int width, int height) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            return pngOutputStream.toByteArray();
        } catch (Exception e) {
            log.error("Error generating QR code image", e);
            throw new RuntimeException(CommonMessages.QR_CODE_GENERATION_FAILED);
        }
    }

    @Override
    public ReservationResponse verifyToken(String token) {
        QrPass qrPass = qrPassRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid QR Token"));

        Reservation reservation = qrPass.getReservation();

        return ReservationResponse.builder()
                .reservationId(reservation.getId())
                .userId(reservation.getUser().getId())
                .stallCodes(reservation.getStalls().stream().map(Stall::getStallCode).collect(Collectors.toList()))
                .reservationDate(reservation.getReservationDate())
                .reservationStatus(reservation.getReservationStatus())
                .build();
    }

    private void sendQrEmail(Reservation reservation, byte[] qrImage) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(reservation.getUser().getEmail());
        helper.setSubject("Reservation Confirmed - Your QR Pass");
        helper.setText("Dear " + reservation.getUser().getBusinessName() + ",\n\n" +
                "Your reservation for stalls " +
                reservation.getStalls().stream().map(Stall::getStallCode).collect(Collectors.joining(", ")) +
                " has been confirmed.\n\n" +
                "Please find your QR Pass attached. Use this for entry.\n\n" +
                "Thank you,\nBookfair Team");

        helper.addAttachment("qr-pass.png", new ByteArrayResource(qrImage));

        javaMailSender.send(message);
    }
}
