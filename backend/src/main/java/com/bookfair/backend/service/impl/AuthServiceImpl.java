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
            e.printStackTrace();  // Check the console for the real error
            throw new RuntimeException("Registration failed");
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
}
