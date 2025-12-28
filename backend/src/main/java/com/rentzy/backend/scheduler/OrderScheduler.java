package com.rentzy.backend.scheduler;

import com.rentzy.backend.model.Order;
import com.rentzy.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class OrderScheduler {

    private final OrderRepository orderRepository;

    // Chạy mỗi 1 phút (60000ms) để quét đơn hàng
    @Scheduled(fixedRate = 60000) 
    @Transactional
    public void autoUpdateOrderStatus() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime fiveMinutesAgo = now.minusMinutes(5); // Mốc thời gian 5 phút trước

        // --- LOGIC 1: Chờ Xác Nhận -> Chờ Giao Hàng (Sau 5 phút từ lúc đặt) ---
        List<Order> pendingOrders = orderRepository.findAllByStatus("Chờ Xác Nhận");
        
        for (Order order : pendingOrders) {
            // Nếu đơn tạo cách đây hơn 5 phút
            if (order.getCreatedAt().isBefore(fiveMinutesAgo)) {
                order.setStatus("Chờ Giao Hàng");
                // order.setUpdatedAt(now); // @PreUpdate sẽ tự làm việc này
                orderRepository.save(order);
                System.out.println("Auto-update: Đơn " + order.getId() + " -> Chờ Giao Hàng");
            }
        }

        // --- LOGIC 2: Đang Giao Hàng -> Đã Giao Hàng (Sau 5 phút từ lúc ship) ---
        List<Order> shippingOrders = orderRepository.findAllByStatus("Đang Giao Hàng");

        for (Order order : shippingOrders) {
            // Dùng updatedAt để biết đơn này chuyển sang "Đang Giao" từ lúc nào
            // Nếu update lần cuối cách đây hơn 5 phút
            if (order.getUpdatedAt() != null && order.getUpdatedAt().isBefore(fiveMinutesAgo)) {
                order.setStatus("Đã Giao Hàng");
                orderRepository.save(order);
                System.out.println("Auto-update: Đơn " + order.getId() + " -> Đã Giao Hàng");
            }
        }
    }
}