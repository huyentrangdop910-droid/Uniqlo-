package com.rentzy.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderCode; 
    
    private Long totalAmount; 

    private String status; 

    private String paymentMethod; // VNPAY, COD
   

    // THÊM CÁC TRƯỜNG NÀY:
    private String shippingName;
    private String shippingPhone;
    private String shippingAddress; 


    @CreationTimestamp
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt; 

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    // Quan hệ 1-Nhiều với chi tiết đơn hàng
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderDetail> orderDetails;
    @PrePersist 
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    // Hàm này tự chạy trước khi update DB
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}