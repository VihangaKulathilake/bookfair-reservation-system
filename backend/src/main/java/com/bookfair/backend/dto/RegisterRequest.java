package com.bookfair.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String businessName;
    private String email;
    private String password;
    private String contactNumber;
    private String address;
    private String contactPerson;
}
