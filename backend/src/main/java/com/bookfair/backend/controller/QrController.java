package com.bookfair.backend.controller;

import com.bookfair.backend.dto.ReservationResponse;
import com.bookfair.backend.service.QrCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/qr")
@RequiredArgsConstructor
public class QrController {

    private final QrCodeService qrCodeService;

    @GetMapping("/verify")
    public ReservationResponse verifyToken(@RequestParam String token) {
        return qrCodeService.verifyToken(token);
    }
}
