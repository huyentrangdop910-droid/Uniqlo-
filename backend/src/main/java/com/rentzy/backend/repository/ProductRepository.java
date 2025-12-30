
package com.rentzy.backend.repository;

import com.rentzy.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Hàm tìm kiếm theo Tên HOẶC Mô tả (chứa từ khoá, không phân biệt hoa thường)
    List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
    //Tìm theo khoảng giá
    List<Product> findByNameContainingIgnoreCaseAndPriceBetween(String name, Double min, Double max);
    List<Product> findByIsActiveTrue();
    // Hàm tìm kiếm theo khoảng giá
    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);
}