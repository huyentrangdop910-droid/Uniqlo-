package com.rentzy.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "cart_items") 
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 1. Liên kết Nhiều-Một (Many-to-One) với Cart
    // Nhiều món hàng thuộc về MỘT giỏ hàng
    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false) // Khóa ngoại 'cart_id'
    @JsonIgnore // Bỏ qua khi gửi JSON, tránh lặp vô hạn
    @ToString.Exclude
    private Cart cart;

    // 2. Liên kết Nhiều-Một (Many-to-One) với Product
    // Nhiều món hàng có thể trỏ đến CÙNG MỘT sản phẩm
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false) // Khóa ngoại 'product_id'
    private Product product;

    // 3. Thông tin bạn đã chọn ở frontend
    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private String size;

    @Column(nullable = false)
    private String color; // Lưu mã màu hex (ví dụ: #FFFFFF)
}