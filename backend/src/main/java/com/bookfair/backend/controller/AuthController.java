package com.bookfair.backend.controller;

import com.bookfair.backend.service.AuthService;

public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


}
