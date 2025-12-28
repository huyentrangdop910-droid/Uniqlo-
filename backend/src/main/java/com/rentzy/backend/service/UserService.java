package com.rentzy.backend.service;

import com.rentzy.backend.dto.ChangePasswordRequest;
import com.rentzy.backend.dto.RegisterRequest;
import com.rentzy.backend.dto.UpdateProfileRequest;
import com.rentzy.backend.dto.UserProfileResponse;
import com.rentzy.backend.exception.NotFoundException;
import com.rentzy.backend.model.Role;
import com.rentzy.backend.model.User;
import com.rentzy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Để mã hóa mật khẩu
    private final FileStorageService fileStorageService;

    // 1. Lấy thông tin cá nhân
    public UserProfileResponse getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found"));

        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .avatarUrl(user.getAvatarUrl())
               .role(user.getRole())
                .build();
    }

    // 2. Cập nhật thông tin
    @Transactional
    public UserProfileResponse updateProfile(String username, UpdateProfileRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found"));

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());        

        User savedUser = userRepository.save(user);

        return getUserProfile(savedUser.getUsername());
    }

    // 3. Đổi mật khẩu
    @Transactional
    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found"));

        // Kiểm tra mật khẩu cũ
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalStateException("Mật khẩu hiện tại không đúng");
        }

        // Kiểm tra xác nhận mật khẩu mới
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalStateException("Xác nhận mật khẩu không khớp");
        }

        // Mã hóa và lưu mật khẩu mới
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    // 4. Xóa tài khoản
    @Transactional
    public void deleteAccount(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found"));
        
        userRepository.delete(user);
    }

    // 5. Lấy danh sách tất cả Nhân viên
    public List<UserProfileResponse> getAllStaffs() {
        List<User> staffs = userRepository.findByRole(Role.STAFF);
        return staffs.stream().map(user -> UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber()) 
                .address(user.getAddress())// Hoặc getPhone() tùy entity của bạn
                .role(user.getRole())
                .build()
        ).collect(Collectors.toList());
    }

    // 6. Tạo tài khoản STAFF mới (Dành cho Admin)
    @Transactional
    public UserProfileResponse createStaff(RegisterRequest request) {
        // Kiểm tra trùng lặp
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        // Tạo User entity
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Mã hóa pass
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhone()); 
        user.setRole(Role.STAFF); 

        User savedUser = userRepository.save(user);

        return UserProfileResponse.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .fullName(savedUser.getFullName())
                .role(savedUser.getRole())
                .build();
    }

    // 7. Xóa nhân viên theo ID
    @Transactional
    public void deleteUserById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new NotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }
    // 8. Cập nhật thông tin nhân viên (Dành cho Admin)
    @Transactional
    public UserProfileResponse updateStaff(Long id, RegisterRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy nhân viên"));

        // Cập nhật các thông tin cơ bản
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhone()); 
        user.setAddress(request.getAddress());

        // Nếu có nhập mật khẩu mới thì cập nhật, bỏ trống thì giữ nguyên
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User savedUser = userRepository.save(user);
        return getUserProfile(savedUser.getUsername());
    }
    // --- Lấy danh sách Khách hàng (Những người có Role là USER) ---
    public List<UserProfileResponse> getAllCustomers() {
        List<User> customers = userRepository.findByRole(Role.USER);
        
        return customers.stream().map(user -> UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber()) 
                .address(user.getAddress())
                .role(user.getRole())
                .build()
        ).collect(Collectors.toList());
    }
    @Transactional
    public UserProfileResponse updateAvatar(String username, MultipartFile file) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found"));

        // 1. Lưu file vào thư mục uploads
        String fileName = fileStorageService.storeFile(file);

        // 2. Tạo URL đầy đủ cho ảnh
        String fileUrl = "http://localhost:8080/uploads/" + fileName;

        // 3. Lưu đường dẫn này vào Database
        user.setAvatarUrl(fileUrl);
        
        User savedUser = userRepository.save(user);
        return getUserProfile(savedUser.getUsername());
    }
   
}