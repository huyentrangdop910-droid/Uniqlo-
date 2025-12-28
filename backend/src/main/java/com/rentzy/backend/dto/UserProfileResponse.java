package com.rentzy.backend.dto;

import lombok.Builder;
import lombok.Data;
import com.rentzy.backend.model.Role; // Import Role

@Data
@Builder
public class UserProfileResponse {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String phoneNumber;
    private Role role;
    private String address;
    private String avatarUrl;
}