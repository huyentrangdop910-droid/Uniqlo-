package com.rentzy.backend.dto;

import lombok.Data;

// DTO này nhận size VÀ màu mới
@Data
public class UpdateVariantRequest {
    private String size;
    private String color; // Mã hex
}