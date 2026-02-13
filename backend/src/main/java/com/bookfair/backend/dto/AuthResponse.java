package com.bookfair.backend.dto;

import lombok.Getter;
import org.springframework.stereotype.Repository;

@Getter
@Repository
public class AuthResponse {

    private String string;

    public AuthResponse (String string) {
        this.string = string;
    }

}
