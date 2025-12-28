
package com.rentzy.backend.repository;

import com.rentzy.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // 1. Lấy đơn hàng của 1 người dùng cụ thể
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    // 2. Lấy TẤT CẢ đơn hàng (Dành cho Admin/Staff) - Mới nhất lên đầu
    List<Order> findAllByOrderByCreatedAtDesc();

    // 3. Tính tổng doanh thu
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'Đã Thanh Toán'")
    Long sumTotalRevenue();

    // 4. Đếm tổng số đơn hàng
    long count();
    List<Order> findAllByStatus(String status);
}