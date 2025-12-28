
package com.rentzy.backend.config.startup;

import com.rentzy.backend.model.Product;
import com.rentzy.backend.model.ProductColor;
import com.rentzy.backend.model.ProductRating;
import com.rentzy.backend.model.Role;
import com.rentzy.backend.repository.ProductRepository;
import com.rentzy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Nạp Admin nếu chưa có
        if (userRepository.findByUsername("admin").isEmpty()) {
            var admin = com.rentzy.backend.model.User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123456"))
                    .fullName("Quản Trị Viên")
                    .email("admin@rentzy.vn")
                    .phone("0312345678")
                    .phoneNumber("0900000000")
                    .address("Trụ sở chính")
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println(">>>>> ĐÃ TẠO TÀI KHOẢN ADMIN: admin / admin123456 <<<<<");
        }

        // 2. Nạp Sản phẩm nếu bảng trống
        if (productRepository.count() == 0) {
            loadProductsData();
        }
    }

    private void loadProductsData() {
        // Lưu ý: Đã xoá dòng .id(...) để Database tự sinh ID (1, 2, 3...)
        // Đã thêm .stockQuantity(...) và .importPrice(...)

        Product p1 = Product.builder()
                .name("Áo Sơ Mi")
                .price(784000)
                .importPrice(500000) // Giá nhập (thấp hơn giá bán)
                .stockQuantity(50)   // Tồn kho ban đầu
                .isActive(true)
                .sizes(List.of("XS", "S", "M", "L", "XL"))
                .rating(new ProductRating(4.8, 102))
                .imageUrls(List.of("https://images.unsplash.com/photo-1562657916-d8ce834d5f50?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDV8fGNvdHRvbiUyMGphY2tldHxlbnwwfHwwfHx8MA%3D%3D"))
                .colors(List.of(
                        new ProductColor("BLACK", "#383B3C"),
                        new ProductColor("BEIGE", "#D1C8C0"),
                        new ProductColor("NAVY", "#180930ff")
                ))
                .description("Một chiếc áo khoác parka có đệm nhẹ và ấm áp.")
                .details("Vải mặt: 100% Nylon. Lớp lót: 100% Polyester.")

                .build();

        Product p2 = Product.builder()
                .name("Áo Khoác Lông Vũ Dáng Ngắn")
                .price(984000)
                .importPrice(700000)
                .stockQuantity(30)
                .sizes(List.of("S", "M", "L"))
                .rating(new ProductRating(4.8, 102))
                .imageUrls(List.of("https://plus.unsplash.com/premium_photo-1674718917175-70e7062732e5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZG93biUyMGphY2tldHxlbnwwfHwwfHx8MA%3D%3D"))
                .colors(List.of(
                        new ProductColor("DARK BROWN", "#383B3C"),
                        new ProductColor("BEIGE", "#D1C8C0"),
                        new ProductColor("RED", "#77353C")
                ))
                .description("Áo khoác dáng ngắn sành điệu.")
                .details("Vải mặt: 100% Nylon. Lớp lót: 100% Polyester.")
                .build();

        Product p3 = Product.builder()
                .name("Sanrio Characters Áo Thun")
                .price(584000)
                .importPrice(300000)
                .stockQuantity(100)
                .sizes(List.of("XS", "S", "M", "L"))
                .rating(new ProductRating(4.8, 102))
                .imageUrls(List.of("https://images.unsplash.com/photo-1562157873-818bc0726f68?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHQlMjBzaGlydCUyMG1vY2t1cHxlbnwwfHwwfHx8MA%3D%3D"))
                .colors(List.of(
                        new ProductColor("WHITE", "#FFFFFF"),
                        new ProductColor("YELLOW", "#b9c41fff")
                ))
                .description("Bộ sưu tập Sanrio Characters dễ thương.")
                .details("100% Cotton.")
                .build();

        Product p4 = Product.builder()
                .name("Áo thun hoạ tiết")
                .price(784000)
                .importPrice(400000)
                .stockQuantity(80)
                .sizes(List.of("XS", "S", "M"))
                .rating(new ProductRating(4.8, 102))
                .imageUrls(List.of("https://images.unsplash.com/photo-1660774986940-7ceeea68158f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTh8fHQlMjBzaGlydCUyMG1vY2t1cHxlbnwwfHwwfHx8MA%3D%3D"))
                .colors(List.of(new ProductColor("BEIGE", "#D1C8C0")))
                .description("Mô tả...")
                .details("...")
                .build();

        Product p5 = Product.builder()
                .name("Áo Cardigan Len Nữ")
                .price(686000)
                .importPrice(350000)
                .stockQuantity(45)
                .sizes(List.of("M", "L", "XL"))
                .rating(new ProductRating(4.8, 102))
                .imageUrls(List.of("https://plus.unsplash.com/premium_photo-1755958633133-851730374ac0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Q2xvdGhpbmclMjBmbGF0JTIwbGF5fGVufDB8fDB8fHww"))
                .colors(List.of(
                        new ProductColor("DARK BROWN", "#383B3C"),
                        new ProductColor("BEIGE", "#D1C8C0")
                ))
                .description("Mô tả...")
                .details("...")
                .build();

        Product p6 = Product.builder()
                .name("Áo Len Cổ Tròn Hoạ Tiết")
                .price(999000)
                .importPrice(650000)
                .stockQuantity(20)
                .sizes(List.of("S", "M"))
                .rating(new ProductRating(4.8, 102))
                .imageUrls(List.of("https://images.unsplash.com/photo-1601379327928-bedfaf9da2d0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3dlYXRlcnN8ZW58MHx8MHx8fDA%3D"))
                .colors(List.of(
                        new ProductColor("DARK GRAY", "#383B3C"),
                        new ProductColor("WHITE", "#fffbf8ff"),
                        new ProductColor("PINK", "#c1b2b3ff")
                ))
                .description("Mô tả...")
                .details("...")
                .build();

        Product p7 = Product.builder()
                .name("Áo Khoác Bò")
                .price(884000)
                .importPrice(500000)
                .stockQuantity(60)
                .sizes(List.of("XS", "S", "L"))
                .rating(new ProductRating(4.8, 102))
                .imageUrls(List.of("https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVuaW0lMjBqYWNrZXR8ZW58MHx8MHx8fDA%3D"))
                .colors(List.of(new ProductColor("BLUE", "#171b47ff")))
                .description("Mô tả...")
                .details("...")
                .build();

        Product p8 = Product.builder()
                .name("Quần Jean Ống Rộng")
                .price(784000)
                .importPrice(400000)
                .stockQuantity(150)
                .sizes(List.of("M", "L"))
                .rating(new ProductRating(4.8, 102))
                .imageUrls(List.of("https://images.unsplash.com/photo-1604176354204-9268737828e4?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8SmVhbnN8ZW58MHx8MHx8fDA%3D"))
                .colors(List.of(new ProductColor("DARK BLUE", "#110f23ff")))
                .description("Mô tả...")
                .details("...")
                .build();

        Product p9 = Product.builder()
                .name("Quần Dài Ống Suông Nữ")
                .price(984000)
                .importPrice(600000)
                .stockQuantity(70)
                .sizes(List.of("XS", "S", "M", "L"))
                .rating(new ProductRating(4.8, 102))
                .imageUrls(List.of("https://images.unsplash.com/photo-1637069585336-827b298fe84a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8SmVhbnN8ZW58MHx8MHx8fDA%3D"))
                .colors(List.of(
                        new ProductColor("BLACK", "#383B3C"),
                        new ProductColor("BEIGE", "#D1C8C0"),
                        new ProductColor("RED", "#9a2733ff")
                ))
                .description("Mô tả...")
                .details("...")
                .build();

        Product p10 = Product.builder()
                .name("Váy Vải Saffon Xếp Tầng")
                .price(484000)
                .importPrice(250000)
                .stockQuantity(40)
                .sizes(List.of("XS", "S", "M"))
                .rating(new ProductRating(4.8, 102))
                .imageUrls(List.of("https://images.unsplash.com/photo-1623609163859-ca93c959b98a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZHJlc3N8ZW58MHx8MHx8fDA%3D"))
                .colors(List.of(new ProductColor("PINK", "#dbb2b6ff")))
                .description("Mô tả...")
                .details("...")
                .build();

        Product p11 = Product.builder()
                .name("Quần Váy")
                .price(684000)
                .importPrice(350000)
                .stockQuantity(55)
                .sizes(List.of("L", "XL"))
                .rating(new ProductRating(4.8, 102))
                .imageUrls(List.of("https://plus.unsplash.com/premium_photo-1673367751771-f13597abadf3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8U2tpcnR8ZW58MHx8MHx8fDA%3D"))
                .colors(List.of(new ProductColor("BROWN", "#844b17ff")))
                .description("Mô tả...")
                .details("...")
                .build();

        Product p12 = Product.builder()
                .name("Quần Sort")
                .price(984000)
                .importPrice(550000)
                .stockQuantity(90)
                .sizes(List.of("XS", "M", "L"))
                .rating(new ProductRating(4.8, 102))
                .imageUrls(List.of("https://images.unsplash.com/photo-1651694558313-fdfc4ee862ba?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvcnQlMjBqZWFuc3xlbnwwfHwwfHx8MA%3D%3D"))
                .colors(List.of(new ProductColor("GRAY", "#696969ff")))
                .description("Mô tả...")
                .details("...")
                .build();

        // --- LƯU VÀO DATABASE ---
        productRepository.saveAll(List.of(
                p1, p2, p3, p4, p5, p6,
                p7, p8, p9, p10, p11, p12
        ));
        
        System.out.println("========= ĐÃ NẠP DỮ LIỆU MẪU THÀNH CÔNG =========");
    }
}