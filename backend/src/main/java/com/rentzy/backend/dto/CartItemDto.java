package com.rentzy.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartItemDto {
    private Long id; // ID của món hàng (CartItem)
    private Long productId; // ID của sản phẩm
    private String productName;
    private String productImageUrl; // Link ảnh
    private int price;
    private int quantity;
    private String size;
    private String color;
}