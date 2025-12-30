
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