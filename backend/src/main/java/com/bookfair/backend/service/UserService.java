package com.bookfair.backend.service;

import com.bookfair.backend.dto.user.UserResponse;

import java.util.List;

public interface UserService {
    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);
}
