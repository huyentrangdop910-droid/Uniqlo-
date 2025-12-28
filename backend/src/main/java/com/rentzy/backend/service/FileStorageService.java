package com.rentzy.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    // Tên thư mục chứa ảnh (nó sẽ nằm ngay ngoài cùng project)
    private final Path storageLocation = Paths.get("uploads");

    public FileStorageService() {
        try {
            // Tự động tạo thư mục uploads nếu chưa có
            Files.createDirectories(storageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Không thể tạo thư mục upload.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        try {
            // Tạo tên file ngẫu nhiên để không bị trùng
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

            // Copy file từ request vào thư mục uploads
            Path destinationFile = this.storageLocation.resolve(fileName).normalize().toAbsolutePath();
            
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            return fileName; // Trả về tên file để lưu vào DB
        } catch (IOException ex) {
            throw new RuntimeException("Lỗi lưu file.", ex);
        }
    }
}