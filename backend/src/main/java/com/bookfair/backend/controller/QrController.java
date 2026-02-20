package com.bookfair.backend.controller;

import com.bookfair.backend.dto.ReservationResponse;
import com.bookfair.backend.service.QrCodeService;
import com.bookfair.backend.util.ApiEndpoints;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiEndpoints.QR_BASE)
@RequiredArgsConstructor
public class QrController {

    private final QrCodeService qrCodeService;

    @GetMapping(ApiEndpoints.VERIFY_QR)
    public ReservationResponse verifyToken(@RequestParam String token) {
        return qrCodeService.verifyToken(token);
    }
}
