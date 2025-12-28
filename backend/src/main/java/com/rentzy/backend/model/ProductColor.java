package com.rentzy.backend.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable // Báo cho JPA biết class này sẽ được "nhúng" vào class khác
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductColor {
    private String name;
    private String code; // Mã màu hex, ví dụ: #FFFFFF
}