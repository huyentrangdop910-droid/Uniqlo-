package com.rentzy.backend.service;

import com.rentzy.backend.dto.AddToCartRequest;
import com.rentzy.backend.dto.CartDto;
import com.rentzy.backend.dto.CartItemDto;
import com.rentzy.backend.dto.UpdateVariantRequest;
import com.rentzy.backend.exception.NotFoundException;
import com.rentzy.backend.model.Cart;
import com.rentzy.backend.model.CartItem;
import com.rentzy.backend.model.Product;
import com.rentzy.backend.model.ProductColor;
import com.rentzy.backend.model.User;
import com.rentzy.backend.repository.CartItemRepository;
import com.rentzy.backend.repository.CartRepository;
import com.rentzy.backend.repository.ProductRepository;
import com.rentzy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    // Tiêm (Inject) tất cả các kho lưu trữ chúng ta cần
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private Long lineTotal;

    // @Transactional đảm bảo tất cả các thao tác (tìm, sửa, lưu)
    // đều thành công, nếu 1 cái lỗi, nó sẽ "quay lui" (rollback)
   
    @Transactional
    public CartItemDto addToCart(AddToCartRequest request, String username) {
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().user(user).build();
                    return cartRepository.save(newCart);
                });

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(request.getProductId())
                             && item.getSize().equals(request.getSize())
                             && item.getColor().equals(request.getColor()))
                .findFirst();

        CartItem savedItem;

        if (existingItem.isPresent()) {
            // Nếu đã có: Cập nhật số lượng
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            savedItem = cartItemRepository.save(item);
        } else {
            // Nếu chưa có: Tạo mới
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .size(request.getSize())
                    .color(request.getColor())
                    .build();
            cart.getItems().add(newItem);
            // Lưu giỏ hàng để lấy ID của item mới
            Cart savedCart = cartRepository.save(cart);
            // Lấy item vừa thêm (item cuối cùng trong danh sách)
            savedItem = savedCart.getItems().get(savedCart.getItems().size() - 1);
        }

        // QUAN TRỌNG: Trả về DTO để frontend lấy được ID
        return mapToCartItemDto(savedItem);
    }
   
// API MỚI: Mua Ngay (Ghi đè số lượng)
    @Transactional
    public CartItemDto buyNow(AddToCartRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().user(user).build();
                    return cartRepository.save(newCart);
                });

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(request.getProductId())
                             && item.getSize().equals(request.getSize())
                             && item.getColor().equals(request.getColor()))
                .findFirst();

        CartItem savedItem;

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(request.getQuantity()); // <-- QUAN TRỌNG
            savedItem = cartItemRepository.save(item);
        } else {
            // Nếu chưa có, tạo mới như bình thường
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .size(request.getSize())
                    .color(request.getColor())
                    .build();
            cart.getItems().add(newItem);
            Cart savedCart = cartRepository.save(cart);
            savedItem = savedCart.getItems().get(savedCart.getItems().size() - 1);
        }

        return mapToCartItemDto(savedItem);
    }
    /**
     * THÊM MỚI: Xử lý logic Lấy Giỏ hàng
     */
    public CartDto getCart(String username) {
        // 1. Tìm User
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        // 2. Tìm Giỏ hàng của User (hoặc tạo mới nếu chưa có)
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().user(user).build();
                    return cartRepository.save(newCart);
                });

        // 3. Chuyển đổi List<CartItem> thành List<CartItemDto>
        List<CartItemDto> itemDtos = cart.getItems().stream()
                .map(this::mapToCartItemDto) // Gọi hàm chuyển đổi
                .toList();

        // 4. Trả về CartDto
        return CartDto.builder()
                .id(cart.getId())
                .items(itemDtos)
                .build();
    }
    

    @Transactional
    public void deleteCartItem(Long cartItemId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy món hàng"));
        
        // Kiểm tra an toàn: Đảm bảo món hàng này thuộc về user đang đăng nhập
        if (!item.getCart().getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("Bạn không có quyền xóa món hàng này");
        }

        cartItemRepository.delete(item);
    }

    @Transactional
    public CartItemDto updateItemQuantity(Long cartItemId, int changeAmount, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy món hàng"));

        if (!item.getCart().getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("Bạn không có quyền sửa món hàng này");
        }

        int newQuantity = item.getQuantity() + changeAmount;

        if (newQuantity <= 0) {
            // Nếu giảm về 0, thì Xóa
            cartItemRepository.delete(item);
            return null; // Trả về null để báo là đã xóa
        } else {
            // Nếu > 0, cập nhật
            item.setQuantity(newQuantity);
            CartItem updatedItem = cartItemRepository.save(item);
            return mapToCartItemDto(updatedItem); // Trả về món hàng đã cập nhật
        }
    }

    @Transactional
    public CartItemDto updateCartItemVariant(Long cartItemId, UpdateVariantRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy món hàng"));

        // Kiểm tra an toàn
        if (!item.getCart().getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("Bạn không có quyền sửa món hàng này");
        }

        // Cập nhật size và màu mới
        item.setSize(request.getSize());
        item.setColor(request.getColor());
        
        CartItem updatedItem = cartItemRepository.save(item);
        return mapToCartItemDto(updatedItem); // Trả về món hàng đã cập nhật
    }

    /**
     * THÊM MỚI: Hàm trợ giúp (helper) để chuyển CartItem -> CartItemDto
     */
    private CartItemDto mapToCartItemDto(CartItem item) {
        String colorName = item.getProduct().getColors().stream()
                .filter(color -> color.getCode().equals(item.getColor()))
                .findFirst()
                .map(ProductColor::getName) // Lấy ra 'name' (vd: "WHITE")
                .orElse(item.getColor());
        return CartItemDto.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                // Lấy ảnh đầu tiên trong danh sách ảnh
                .productImageUrl(item.getProduct().getImageUrls().get(0)) 
                .price(item.getProduct().getPrice())
                .quantity(item.getQuantity())
                .size(item.getSize())
                .color(colorName)
                .build();
    }
   
}

