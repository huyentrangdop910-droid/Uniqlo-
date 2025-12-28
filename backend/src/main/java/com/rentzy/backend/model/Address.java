package com.rentzy.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String phoneNumber;
    private String city;
    private String district;
    private String ward;
    private String streetAddress; // Số nhà, tên đường
    
    private boolean isDefault; // Địa chỉ mặc định

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
}