package com.rentzy.backend.repository;

import com.rentzy.backend.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    
    // Spring Data JPA tự tạo câu lệnh:
    // "SELECT * FROM carts WHERE user_id = ?"
    Optional<Cart> findByUserId(Long userId);
}