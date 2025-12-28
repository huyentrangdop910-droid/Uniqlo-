package com.rentzy.backend.dto;

import lombok.Data;

@Data
public class AddressRequest {
    private String fullName;
    private String phoneNumber;
    private String city;
    private String district;
    private String ward;
    private String streetAddress;
    private boolean isDefault;
}