package com.bookfair.backend.service;

import com.bookfair.backend.dto.AuthResponse;
import com.bookfair.backend.dto.LoginRequest;
import com.bookfair.backend.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register (RegisterRequest registerRequest);
    AuthResponse login (LoginRequest loginRequest);
    boolean existsByEmail(String email);
    void resetPassword(com.bookfair.backend.dto.PasswordResetRequest request);
}
