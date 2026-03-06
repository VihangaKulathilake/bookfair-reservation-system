package com.bookfair.backend.service.impl;

import com.bookfair.backend.config.JwtService;
import com.bookfair.backend.dto.AuthResponse;
import com.bookfair.backend.dto.LoginRequest;
import com.bookfair.backend.dto.RegisterRequest;
import com.bookfair.backend.enums.Role;
import com.bookfair.backend.model.User;
import com.bookfair.backend.repository.UserRepository;
import com.bookfair.backend.service.AuthService;
import com.bookfair.backend.util.CommonMessages;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;


    public AuthServiceImpl(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Override
    public AuthResponse register(RegisterRequest registerRequest) {
        try {
            if (userRepository.existsByEmail(registerRequest.getEmail())){
                throw new RuntimeException(CommonMessages.EMAIL_ALREADY_EXISTS);
            }

            validatePasswordComplexity(registerRequest.getPassword());

            User user = new User();
            user.setBusinessName(registerRequest.getBusinessName());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setContactNumber(registerRequest.getContactNumber());
            user.setAddress(registerRequest.getAddress());
            user.setContactPerson(registerRequest.getContactPerson());
            user.setRole(Role.BUSINESS);

            userRepository.save(user);

            String token = jwtService.generateToken(user.getEmail());
            return new AuthResponse(user.getId(), user.getBusinessName(), user.getContactPerson(), token);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }


    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(()->new RuntimeException(CommonMessages.INVALID_EMAIL_OR_PASSWORD));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())){
            throw new RuntimeException(CommonMessages.INVALID_EMAIL_OR_PASSWORD);
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(user.getId(), user.getBusinessName(), user.getContactPerson(), token);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void resetPassword(com.bookfair.backend.dto.PasswordResetRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException(CommonMessages.USER_NOT_FOUND));
        
        validatePasswordComplexity(request.getNewPassword());
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private void validatePasswordComplexity(String password) {
        if (password == null || password.length() < 8) {
            throw new RuntimeException("Password must be at least 8 characters long");
        }
        
        boolean hasUpper = false;
        boolean hasLower = false;
        boolean hasDigit = false;
        boolean hasSpecial = false;
        
        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpper = true;
            else if (Character.isLowerCase(c)) hasLower = true;
            else if (Character.isDigit(c)) hasDigit = true;
            else if (!Character.isLetterOrDigit(c)) hasSpecial = true;
        }
        
        if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
            throw new RuntimeException("Password must include uppercase, lowercase, number, and symbol");
        }
    }
}
