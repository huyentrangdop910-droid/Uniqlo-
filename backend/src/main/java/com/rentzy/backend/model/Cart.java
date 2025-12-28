package com.rentzy.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "carts") // Tên bảng là 'carts'
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 1. Liên kết Một-Một (One-to-One) với User
    // Một giỏ hàng chỉ thuộc về MỘT User
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false) // Khóa ngoại 'user_id'
    @JsonIgnore // Bỏ qua khi gửi JSON, tránh lặp vô hạn
    @ToString.Exclude
    private User user;

    // 2. Liên kết Một-Nhiều (One-to-Many) với CartItem
    // Một giỏ hàng có NHIỀU món hàng
    @OneToMany(
            mappedBy = "cart", // 'cart' là tên biến trong CartItem.java
            cascade = CascadeType.ALL, // Tự động lưu/xóa CartItem khi Cart thay đổi
            orphanRemoval = true // Tự động xóa CartItem nếu nó bị xóa khỏi List
    )
    @Builder.Default 
    @ToString.Exclude
    private List<CartItem> items = new ArrayList<>();
}