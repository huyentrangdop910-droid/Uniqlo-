package com.rentzy.backend.repository;

import com.rentzy.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    // Tự động tạo câu lệnh: "SELECT * FROM reviews WHERE product_id = ?"
    List<Review> findByProductId(Long productId);
}