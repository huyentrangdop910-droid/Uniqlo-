package com.rentzy.backend.service;

import com.rentzy.backend.dto.ReviewRequest;
import com.rentzy.backend.exception.NotFoundException;
import com.rentzy.backend.model.Product;
import com.rentzy.backend.model.Review;
import com.rentzy.backend.model.User;
import com.rentzy.backend.repository.ProductRepository;
import com.rentzy.backend.repository.ReviewRepository;
import com.rentzy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // Lấy tất cả review của 1 sản phẩm
    public List<Review> getReviewsForProduct(Long productId) {
        return reviewRepository.findByProductId(productId);
    }
    
    // Lấy tất cả review (để test)
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // Tạo 1 review mới
    public Review createReview(ReviewRequest request, String username) {
        // 1. Tìm User
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));
        
        // 2. Tìm Product
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm"));
        
        // 3. Tạo Review
        Review newReview = Review.builder()
                .user(user)
                .product(product)
                .rating(request.getRating())
                .title(request.getTitle())
                .comment(request.getComment())
                // createdAt sẽ được gán tự động
                .build();
        
        // 4. Lưu và trả về
        return reviewRepository.save(newReview);
    }

    // THÊM MỚI: Xóa 1 review
    @Transactional
    public void deleteReview(Long reviewId, String username) {
        // 1. Tìm User
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        // 2. Tìm Review
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đánh giá"));

        // 3. KIỂM TRA BẢO MẬT QUAN TRỌNG:
        if (!review.getUser().getId().equals(user.getId())) {
            // Nếu không phải, ném lỗi 403 (Cấm)
            throw new IllegalStateException("Bạn không có quyền xóa đánh giá này");
        }

        // 4. Nếu là chủ, cho phép xóa
        reviewRepository.delete(review);
    }

    // THÊM MỚI: Sửa review
    @Transactional
    public Review updateReview(Long reviewId, ReviewRequest request, String username) {
        // 1. Tìm User
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        // 2. Tìm Review
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đánh giá"));

        // 3. KIỂM TRA BẢO MẬT: Phải là chính chủ
        if (!review.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("Bạn không có quyền sửa đánh giá này");
        }

        // 4. Cập nhật thông tin mới
        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setComment(request.getComment());
        
        // 5. Lưu và trả về
        return reviewRepository.save(review);
    }

}
