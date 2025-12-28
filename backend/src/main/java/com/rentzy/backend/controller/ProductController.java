
package com.rentzy.backend.controller;

import com.rentzy.backend.model.Product;
import com.rentzy.backend.service.ProductService;
import com.rentzy.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ProductRepository productRepository;

    // 1. Lấy danh sách cho KHÁCH HÀNG (Chỉ lấy hàng đang hiện - isActive = true)
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getPublicProducts());
    }

    // 2. Lấy danh sách cho ADMIN (Lấy tất cả để quản lý)
    @GetMapping("/admin-list")
    public ResponseEntity<List<Product>> getAdminProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // 3. Chi tiết sản phẩm
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductDetails(@PathVariable Long id) {
        try {
            Product product = productService.getProductById(id);
            if (product == null) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 4. Tìm kiếm
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(
            // Sửa 1: Thêm required = false để tránh lỗi khi không nhập tên
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(required = false, defaultValue = "0") Double min,
            @RequestParam(required = false, defaultValue = "2000000000") Double max) {
        try {
            List<Product> products;

            if (query != null && !query.trim().isEmpty()) {
                // Trường hợp 1: Có nhập tên -> Tìm theo Tên + Giá
                // Gọi trực tiếp Repository
                products = productRepository.findByNameContainingIgnoreCaseAndPriceBetween(query, min, max);
            } else {
                // Trường hợp 2: Không nhập tên -> Chỉ lọc theo Giá
                products = productRepository.findByPriceBetween(min, max);
            }
            
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            // In lỗi ra console để biết tại sao sai (quan trọng để debug)
            e.printStackTrace(); 
            return ResponseEntity.badRequest().build();
        }
    }

    // --- CÁC API QUẢN TRỊ (ADMIN) ---

    // 5. Tạo sản phẩm mới
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
       
        product.setActive(false); 
        return ResponseEntity.ok(productService.saveProduct(product));
    }

    // 6. Cập nhật sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        try {
            Product existingProduct = productService.getProductById(id);
            if (existingProduct == null) return ResponseEntity.notFound().build();

            // Cập nhật thông tin
            existingProduct.setName(productDetails.getName());
            existingProduct.setPrice(productDetails.getPrice());
            existingProduct.setImportPrice(productDetails.getImportPrice());
            existingProduct.setStockQuantity(productDetails.getStockQuantity());
            existingProduct.setDescription(productDetails.getDescription());
            existingProduct.setDetails(productDetails.getDetails());
            existingProduct.setImageUrls(productDetails.getImageUrls());
            existingProduct.setSizes(productDetails.getSizes());
            existingProduct.setColors(productDetails.getColors()); // Cập nhật cả màu
            
            // Lưu ý: Không cập nhật isActive ở đây để tránh bị reset nhầm
            if (productDetails.isActive() != existingProduct.isActive()) {
                existingProduct.setActive(productDetails.isActive());
            }
            
            return ResponseEntity.ok(productService.saveProduct(existingProduct));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 7. Xoá sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }
    //8 PUT: /api/v1/products/{id}/status?active=true
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateProductStatus(
            @PathVariable Long id, 
            @RequestParam boolean active
    ) {
        try {
            productService.updateStatus(id, active);
            return ResponseEntity.ok("Cập nhật trạng thái thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
    // 9. Lọc sản phẩm theo khoảng giá
    @GetMapping("/filter")
    public ResponseEntity<List<Product>> filterByPrice(
            @RequestParam(required = false, defaultValue = "0") Double min,
            @RequestParam(required = false, defaultValue = "1000000000") Double max) {
        
        List<Product> products = productRepository.findByPriceBetween(min, max);
        return ResponseEntity.ok(products);
    }
}