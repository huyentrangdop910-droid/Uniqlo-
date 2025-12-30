package com.rentzy.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class CartDto {
    private Long id; // ID của giỏ hàng
    private List<CartItemDto> items; // Danh sách các món hàng
    
}