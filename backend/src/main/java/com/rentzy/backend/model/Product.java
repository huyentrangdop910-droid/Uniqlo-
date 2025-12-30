
package com.rentzy.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private int price;       // Giá bán
    private int importPrice; // Giá nhập
    
    private int stockQuantity; // Tồn kho

    
    @Builder.Default 
    private boolean isActive = true; 

    @ElementCollection 
    private List<String> sizes;

    @ElementCollection
    @Column(columnDefinition = "LONGTEXT") 
    private List<String> imageUrls;

    @ElementCollection
    private List<ProductColor> colors;

    @Embedded
    private ProductRating rating;

    @Column(length = 2048) 
    private String description;

    @Column(length = 2048) 
    private String details;
}