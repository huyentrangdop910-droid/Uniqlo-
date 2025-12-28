package com.rentzy.backend.repository;

import com.rentzy.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.rentzy.backend.model.Role;
import java.util.List;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    
    long countByRole(Role role);

    // Lấy danh sách user dựa theo quyền (VD: Lấy tất cả STAFF)
    List<User> findByRole(Role role);
    
    // Kiểm tra trùng username hoặc email
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
}