package com.bookfair.backend.dto;

import lombok.Data;
import lombok.Getter;
import org.springframework.stereotype.Repository;

@Data
public class AuthResponse {

    private String string;

    public AuthResponse (String string) {
        this.string = string;
    }

}
