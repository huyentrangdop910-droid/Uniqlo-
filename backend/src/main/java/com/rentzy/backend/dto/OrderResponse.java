
package com.rentzy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private Long id;
    private String orderCode;
    private Long totalAmount;
    private String status;
    private String paymentMethod;
    private LocalDateTime createdAt;
    
    // Thông tin giao hàng
    private String shippingName;
    private String shippingPhone;
    private String shippingAddress;

    private String fullName;     // Tên người mua
    private String phoneNumber;  // SĐT người mua

    private List<CartItemDto> items;
}