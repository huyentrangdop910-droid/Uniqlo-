package com.rentzy.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStats {
    private Long totalRevenue;
    private long totalCustomers;
    private long totalOrders;
    // (Sau này có thể thêm list data cho biểu đồ ở đây)
}