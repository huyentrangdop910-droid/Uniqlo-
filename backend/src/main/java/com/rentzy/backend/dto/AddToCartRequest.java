package com.rentzy.backend.dto;

import lombok.Data;

@Data
public class AddToCartRequest {
    private Long productId;
    private int quantity;
    private String size;
    private String color; // Lưu mã màu hex (ví dụ: #FFFFFF)
}