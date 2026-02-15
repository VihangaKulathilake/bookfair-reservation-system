package com.bookfair.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
public class LoginRequest {

    private String email;
    private String password;

}
