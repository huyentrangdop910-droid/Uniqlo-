/*package com.rentzy.backend.repository;

import com.rentzy.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.jpa.repository.Query; // <-- THÊM DÒNG NÀY
import org.springframework.data.repository.query.Param; // <-- THÊM DÒNG NÀY
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Spring Data JPA sẽ tự động tạo các hàm:
    // save(), findById(), findAll(), delete()...
    
    // Chúng ta sẽ thêm hàm tìm kiếm (giống kế hoạch của bạn) sau
   @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> findByNameContainingIgnoreCase(@Param("query") String query);
}*/
package com.rentzy.backend.repository;

import com.rentzy.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Hàm tìm kiếm theo Tên HOẶC Mô tả (chứa từ khoá, không phân biệt hoa thường)
    List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
    List<Product> findByNameContainingIgnoreCaseAndPriceBetween(String name, Double min, Double max);
    List<Product> findByIsActiveTrue();
    // Hàm tìm kiếm theo khoảng giá
    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);
}