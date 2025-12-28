package com.rentzy.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class PlaceOrderRequest {
    private String paymentMethod; // "VNPAY" hoặc "COD"
    private List<Long> selectedCartItemIds; // Danh sách ID các món hàng muốn mua
    private Long addressId; // <-- THÊM DÒNG NÀY
}