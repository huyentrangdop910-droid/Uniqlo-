package com.rentzy.backend.service;

import com.rentzy.backend.dto.DashboardStats;
import com.rentzy.backend.model.Role;
import com.rentzy.backend.repository.OrderRepository;
import com.rentzy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ManagerService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public DashboardStats getDashboardStats() {
        // 1. Lấy tổng doanh thu (Nếu null thì trả về 0)
        Long revenue = orderRepository.sumTotalRevenue();
        if (revenue == null) revenue = 0L;

        // 2. Đếm số khách hàng
        long customers = userRepository.countByRole(Role.USER);

        // 3. Đếm số đơn hàng
        long orders = orderRepository.count();

        return DashboardStats.builder()
                .totalRevenue(revenue)
                .totalCustomers(customers)
                .totalOrders(orders)
                .build();
    }
}