
package com.rentzy.backend.controller;

import com.rentzy.backend.service.OrderService;
import com.rentzy.backend.dto.OrderResponse;
import com.rentzy.backend.dto.PlaceOrderRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // Import thêm cái này
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // --- 1. API MỚI: Lấy tất cả đơn hàng (Cho Staff/Admin) ---
    @GetMapping("/all")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // --- 2. API CŨ: Đặt hàng ---
    @PostMapping("/place")
    public ResponseEntity<String> placeOrder(
            @RequestBody PlaceOrderRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) return ResponseEntity.status(401).body("Yêu cầu đăng nhập");
        try {
            orderService.placeOrder(userDetails.getUsername(), request);
            return ResponseEntity.ok("Đặt hàng thành công!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- 3. API CŨ: Lấy đơn của tôi ---
    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(orderService.getMyOrders(userDetails.getUsername()));
    }

    
    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication authentication // Dùng Authentication để check quyền
    ) {
        if (authentication == null) return ResponseEntity.status(401).build();
        
        String username = authentication.getName();
        
        // Check xem user có quyền STAFF hoặc ADMIN không
        boolean isStaffOrAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("STAFF") || a.getAuthority().equals("ADMIN"));

        try {
            if (isStaffOrAdmin) {
                // Nếu là Staff -> Gọi hàm không check chính chủ
                orderService.updateOrderStatusByStaff(id, status);
            } else {
                // Nếu là User thường -> Gọi hàm cũ (có check chính chủ)
                orderService.updateOrderStatus(id, status, username);
            }
            return ResponseEntity.ok("Cập nhật trạng thái thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<String> cancelOrder(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        try { orderService.cancelOrder(id, userDetails.getUsername()); return ResponseEntity.ok("Đã hủy đơn hàng"); } 
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @PutMapping("/{id}/address")
    public ResponseEntity<String> updateOrderAddress(@PathVariable Long id, @RequestParam Long addressId, @AuthenticationPrincipal UserDetails userDetails) {
        try { orderService.updateOrderAddress(id, addressId, userDetails.getUsername()); return ResponseEntity.ok("Đã cập nhật địa chỉ"); } 
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @PutMapping("/{id}/payment")
    public ResponseEntity<String> updateOrderPaymentMethod(@PathVariable Long id, @RequestParam String method, @AuthenticationPrincipal UserDetails userDetails) {
        try { orderService.updateOrderPaymentMethod(id, method, userDetails.getUsername()); return ResponseEntity.ok("Đã cập nhật thanh toán"); } 
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }
}