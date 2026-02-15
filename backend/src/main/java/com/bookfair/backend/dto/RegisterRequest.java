package com.bookfair.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
public class RegisterRequest {

    private String businessName;
    private String email;
    private String password;
    private String contactNumber;

}
