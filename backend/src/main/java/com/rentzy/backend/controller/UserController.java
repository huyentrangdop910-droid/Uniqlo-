package com.rentzy.backend.controller;

import com.rentzy.backend.dto.ChangePasswordRequest;
import com.rentzy.backend.dto.RegisterRequest;
import com.rentzy.backend.dto.UpdateProfileRequest;
import com.rentzy.backend.dto.UserProfileResponse;
import com.rentzy.backend.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication; 
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // GET /api/v1/users/me (Lấy thông tin)
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(userService.getUserProfile(userDetails.getUsername()));
    }

    // PUT /api/v1/users/me (Cập nhật thông tin)
    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateMyProfile(
            @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(userService.updateProfile(userDetails.getUsername(), request));
    }

    // PUT /api/v1/users/me/password (Đổi mật khẩu)
    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        try {
            userService.changePassword(userDetails.getUsername(), request);
            return ResponseEntity.ok("Đổi mật khẩu thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    // DELETE /api/v1/users/me
    @DeleteMapping("/me")
    public ResponseEntity<?> deleteAccount(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        userService.deleteAccount(userDetails.getUsername());
        return ResponseEntity.ok("Tài khoản đã được xóa");
    }
    // --- API MỚI CHO QUẢN TRỊ VIÊN ---

    // 1. Lấy danh sách nhân viên
    @GetMapping("/staffs")
    public ResponseEntity<List<UserProfileResponse>> getAllStaffs() {
        return ResponseEntity.ok(userService.getAllStaffs());
    }

    // 2. Tạo nhân viên mới
    @PostMapping("/staffs")
    public ResponseEntity<UserProfileResponse> createStaff(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.createStaff(request));
    }

    // 3. Xóa nhân viên
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.ok("Xóa thành công");
    }
    // PUT: Cập nhật nhân viên theo ID
    @PutMapping("/{id}")
    public ResponseEntity<UserProfileResponse> updateStaff(@PathVariable Long id, @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.updateStaff(id, request));
    }
    // 4. API Lấy danh sách khách hàng
    @GetMapping("/customers")
    public ResponseEntity<List<UserProfileResponse>> getAllCustomers() {
        return ResponseEntity.ok(userService.getAllCustomers());
    }
    @PostMapping("/avatar")
    public ResponseEntity<UserProfileResponse> updateAvatar(
            @RequestParam("file") MultipartFile file, // Nhận file từ Frontend
            Authentication authentication // Lấy thông tin người đang đăng nhập
    ) {
        // Lấy username từ token (người đang login)
        String username = authentication.getName();
        
        // Gọi Service xử lý
        UserProfileResponse response = userService.updateAvatar(username, file);
        
        return ResponseEntity.ok(response);
    }
   
    
}