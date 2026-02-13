package com.bookfair.backend.dto;

import lombok.Getter;
import lombok.Setter;

public class RegisterRequest {
    // Getters and setters
    @Setter
    @Getter
    private String businessName;

    @Setter
    @Getter
    private String email;

    @Setter
    @Getter
    private String password;

    @Setter
    @Getter
    private String contactNumber;

}
