
package com.rentzy.backend.service;

import com.rentzy.backend.dto.CartItemDto;
import com.rentzy.backend.dto.OrderResponse;
import com.rentzy.backend.dto.PlaceOrderRequest;
import com.rentzy.backend.exception.NotFoundException;
import com.rentzy.backend.model.*;
import com.rentzy.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    // --- 1. API CHO STAFF/ADMIN: Lấy toàn bộ đơn hàng ---
    public List<OrderResponse> getAllOrders() {
        // Lấy tất cả đơn hàng, mới nhất lên đầu
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();

        // Convert sang DTO để trả về Frontend
        return orders.stream().map(this::mapToOrderResponse).collect(Collectors.toList());
    }

    // --- 2. API CHO STAFF/ADMIN: Cập nhật trạng thái (Không cần check chính chủ) ---
    @Transactional
    public void updateOrderStatusByStaff(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));
        
        // Staff được quyền sửa mọi đơn hàng
        order.setStatus(newStatus);
        orderRepository.save(order);
    }


    // Lấy lịch sử đơn hàng của tôi
    public List<OrderResponse> getMyOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found"));
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return orders.stream().map(this::mapToOrderResponse).collect(Collectors.toList());
    }

    // Hàm phụ trợ: Map từ Entity sang DTO (Dùng chung cho gọn code)
    private OrderResponse mapToOrderResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .createdAt(order.getCreatedAt())
                // Mapping thông tin người nhận
                .shippingName(order.getShippingName())
                .shippingPhone(order.getShippingPhone())
                .shippingAddress(order.getShippingAddress())
                .fullName(order.getShippingName()) // Frontend dùng trường này để hiển thị tên
                .phoneNumber(order.getShippingPhone()) // Frontend dùng trường này để hiển thị sđt
                
                .items(order.getOrderDetails().stream().map(detail -> CartItemDto.builder()
                        .productName(detail.getProduct().getName())
                        .productImageUrl(detail.getProduct().getImageUrls().get(0))
                        .price(Math.toIntExact(detail.getPrice()))
                        .quantity(detail.getQuantity())
                        .size(detail.getSize())
                        .color(detail.getColor())
                        .build()).collect(Collectors.toList()))
                .build();
    }

    
    @Transactional
    public void placeOrder(String username, PlaceOrderRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found"));
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new NotFoundException("Cart not found"));

        Address address = null;
        if (request.getAddressId() != null) {
             address = addressRepository.findById(request.getAddressId()).orElse(null);
        }

        List<CartItem> itemsToBuy = cart.getItems().stream()
                .filter(item -> request.getSelectedCartItemIds().contains(item.getId()))
                .collect(Collectors.toList());

        if (itemsToBuy.isEmpty()) return;

        long totalAmount = itemsToBuy.stream()
                .mapToLong(item -> (long) item.getProduct().getPrice() * item.getQuantity())
                .sum();

        Order order = Order.builder()
                .orderCode("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .user(user)
                .totalAmount(totalAmount)
                .paymentMethod(request.getPaymentMethod())
                .status(request.getPaymentMethod().equals("VNPAY") ? "Đã Thanh Toán" : "Chờ Xác Nhận")
                .createdAt(LocalDateTime.now())
                .build();

        if (address != null) {
            order.setShippingName(address.getFullName());
            order.setShippingPhone(address.getPhoneNumber());
            order.setShippingAddress(address.getStreetAddress() + ", " + address.getWard() + ", " + address.getDistrict() + ", " + address.getCity());
        }

        Order savedOrder = orderRepository.save(order);

        List<OrderDetail> details = new ArrayList<>();
        for (CartItem item : itemsToBuy) {
            OrderDetail detail = OrderDetail.builder()
                    .order(savedOrder)
                    .product(item.getProduct())
                    .quantity(item.getQuantity())
                    .price((long) item.getProduct().getPrice())
                    .size(item.getSize())
                    .color(item.getColor())
                    .build();
            details.add(detail);
        }
        savedOrder.setOrderDetails(details);
        orderRepository.save(savedOrder);

        cart.getItems().removeIf(item -> request.getSelectedCartItemIds().contains(item.getId()));
        cartRepository.save(cart); 
    }

    @Transactional
    public void cancelOrder(Long orderId, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("Unauthorized");
        }
        if ("Chờ Xác Nhận".equals(order.getStatus()) || "Đã Thanh Toán".equals(order.getStatus())) {
            order.setStatus("Đã Hủy");
            orderRepository.save(order);
        } else {
            throw new IllegalStateException("Không thể hủy đơn hàng ở trạng thái này");
        }
    }

    @Transactional
    public void updateOrderAddress(Long orderId, Long addressId, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));
        
        if (!order.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("Unauthorized");
        }
        if ("Chờ Xác Nhận".equals(order.getStatus())) {
            Address newAddress = addressRepository.findById(addressId)
                    .orElseThrow(() -> new NotFoundException("Address not found"));
            
            order.setShippingName(newAddress.getFullName());
            order.setShippingPhone(newAddress.getPhoneNumber());
            order.setShippingAddress(newAddress.getStreetAddress() + ", " + newAddress.getWard() + ", " + newAddress.getDistrict() + ", " + newAddress.getCity());
            
            orderRepository.save(order);
        } else {
            throw new IllegalStateException("Chỉ có thể sửa địa chỉ khi đơn hàng chưa thanh toán/đang chờ xác nhận.");
        }
    }

    @Transactional
    public void updateOrderPaymentMethod(Long orderId, String newMethod, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("Unauthorized");
        }
        if ("Chờ Xác Nhận".equals(order.getStatus())) {
            order.setPaymentMethod(newMethod);
            orderRepository.save(order);
        } else {
            throw new IllegalStateException("Không thể sửa phương thức thanh toán khi đơn hàng đã xử lý hoặc đã thanh toán.");
        }
    }

    // Hàm update status cũ (có check chính chủ - dùng cho user)
    @Transactional
    public void updateOrderStatus(Long orderId, String newStatus, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("Unauthorized");
        }
        order.setStatus(newStatus);
        orderRepository.save(order);
    }
}