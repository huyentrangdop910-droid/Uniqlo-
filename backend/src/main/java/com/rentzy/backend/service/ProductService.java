
package com.rentzy.backend.service;

import com.rentzy.backend.model.Product;
import com.rentzy.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor // Tự động inject Repository vào
public class ProductService {

    private final ProductRepository productRepository;

    // 1. Lấy tất cả sản phẩm
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    public List<Product> getPublicProducts() {
        return productRepository.findByIsActiveTrue();
    }
    


    // 2. Lấy chi tiết 1 sản phẩm theo ID
    public Product getProductById(Long id) {
        // Nếu không tìm thấy thì trả về null (Controller sẽ xử lý lỗi 404 sau)
        return productRepository.findById(id).orElse(null);
    }

    // 3. Lưu sản phẩm (Dùng cho cả TẠO MỚI và CẬP NHẬT)
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // 4. Xoá sản phẩm
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // 5. Tìm kiếm sản phẩm
    public List<Product> searchProducts(String keyword) {
        // Gọi hàm tìm kiếm mình vừa viết bên Repository
        return productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
    }
    // --- Hàm mới: Chỉ cập nhật trạng thái Active/Inactive ---
    public void updateStatus(Long id, boolean isActive) {
        Product product = productRepository.findById(id).orElse(null);
        if (product != null) {
            product.setActive(isActive);
            productRepository.save(product);
        }
    }
}