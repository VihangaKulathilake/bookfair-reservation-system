package com.bookfair.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
public class AuthResponse {
    private Long userId;
    private String businessName;
    private String contactPerson;
    private String token;
}
