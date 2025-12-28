package com.rentzy.backend.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;
}