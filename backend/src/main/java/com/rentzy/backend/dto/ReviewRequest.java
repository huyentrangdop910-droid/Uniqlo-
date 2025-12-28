package com.rentzy.backend.dto;

import lombok.Data;

// DTO này nhận dữ liệu từ frontend
@Data
public class ReviewRequest {
    private Long productId;
    private int rating;
    private String title;
    private String comment;
}