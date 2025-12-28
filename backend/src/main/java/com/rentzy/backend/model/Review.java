/*package com.rentzy.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int rating; // Số sao (ví dụ: 5)

    @Column(length = 100)
    private String title; // Tiêu đề đánh giá

    @Column(length = 2048)
    private String comment; // Nội dung bình luận

    @CreationTimestamp // Tự động gán thời gian khi tạo
    private Instant createdAt;

    // Liên kết: Nhiều đánh giá thuộc về MỘT sản phẩm
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnore // Tránh lặp vô hạn khi gửi JSON
    private Product product;

    // Liên kết: Nhiều đánh giá thuộc về MỘT người dùng
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    // (Không @JsonIgnore, vì chúng ta muốn GỬI thông tin user)
    private User user;
}*/
package com.rentzy.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // <--- Import cái này
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int rating;

    @Column(length = 100)
    private String title;

    @Column(length = 2048)
    private String comment;

    @CreationTimestamp
    private Instant createdAt;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnore // Đúng: Không cần gửi lại thông tin sản phẩm khi đang xem review của chính nó
    private Product product;

   
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
   
    // Giúp cắt đứt vòng lặp và bảo mật thông tin
    @JsonIgnoreProperties({"password", "reviews", "orders", "cart", "roles", "tokens"}) 
    private User user;
}