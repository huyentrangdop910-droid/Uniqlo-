package com.rentzy.backend.controller;

import com.rentzy.backend.dto.ReviewRequest;
import com.rentzy.backend.model.Review;
import com.rentzy.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // API 1: POST /api/v1/reviews (Tạo 1 review)
    // (Yêu cầu phải đăng nhập)
    @PostMapping
    public ResponseEntity<Review> createReview(
            @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build(); // 401 Unauthorized
        }
        Review review = reviewService.createReview(request, userDetails.getUsername());
        return ResponseEntity.status(201).body(review); // 201 Created
    }

    // API 2: GET /api/v1/reviews/product/{productId} (Lấy review của 1 sản phẩm)
    // (Công khai, ai cũng xem được)
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getReviewsForProduct(
            @PathVariable Long productId
    ) {
        List<Review> reviews = reviewService.getReviewsForProduct(productId);
        return ResponseEntity.ok(reviews);
    }
    
    // API 3: GET /api/v1/reviews (Lấy TẤT CẢ review, dùng để test)
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    // API 4: DELETE /api/v1/reviews/{id} (Xóa 1 review)
    // (Yêu cầu phải đăng nhập)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReview(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Yêu cầu đăng nhập");
        }

        try {
            reviewService.deleteReview(id, userDetails.getUsername());
            return ResponseEntity.ok("Đã xóa đánh giá thành công");
        } catch (IllegalStateException e) {
            // Lỗi bảo mật (xóa review của người khác)
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // API 5: PUT /api/v1/reviews/{id} (Sửa review)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateReview(
            @PathVariable Long id,
            @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) return ResponseEntity.status(401).body("Yêu cầu đăng nhập");

        try {
            Review updatedReview = reviewService.updateReview(id, request, userDetails.getUsername());
            return ResponseEntity.ok(updatedReview);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
