package com.rentzy.backend.controller;

import com.rentzy.backend.dto.AddToCartRequest;
import com.rentzy.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.rentzy.backend.dto.CartDto;
import com.rentzy.backend.dto.CartItemDto;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.rentzy.backend.dto.UpdateVariantRequest;


@RestController
@RequestMapping("/api/v1/cart") // Đường dẫn gốc cho giỏ hàng
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

  @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @RequestBody AddToCartRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Yêu cầu đăng nhập");
        }

        try {
            CartItemDto newItem = cartService.addToCart(request, userDetails.getUsername());
            return ResponseEntity.ok(newItem); // Trả về JSON (có ID)
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
@PostMapping("/buy-now")
    public ResponseEntity<?> buyNow(
            @RequestBody AddToCartRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) return ResponseEntity.status(401).body("Yêu cầu đăng nhập");
        try {
            CartItemDto item = cartService.buyNow(request, userDetails.getUsername());
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    /**
     * THÊM MỚI: API Lấy thông tin giỏ hàng
     */
@GetMapping
    public ResponseEntity<?> getCart(
            @AuthenticationPrincipal UserDetails userDetails // Tự động lấy user
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Yêu cầu đăng nhập");
        }

        try {
            // Gọi service, trả về giỏ hàng (DTO)
            CartDto cartDto = cartService.getCart(userDetails.getUsername());
            return ResponseEntity.ok(cartDto); 
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<String> deleteCartItem(
            @PathVariable Long itemId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) return ResponseEntity.status(401).body("Yêu cầu đăng nhập");
        try {
            cartService.deleteCartItem(itemId, userDetails.getUsername());
            return ResponseEntity.ok("Đã xóa khỏi giỏ hàng");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/item/{itemId}")
    public ResponseEntity<?> updateCartItem(
            @PathVariable Long itemId,
            @RequestParam int change, // Gửi ?change=1 hoặc ?change=-1
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) return ResponseEntity.status(401).body("Yêu cầu đăng nhập");
        try {
            CartItemDto updatedItem = cartService.updateItemQuantity(itemId, change, userDetails.getUsername());
            if (updatedItem == null) {
                return ResponseEntity.ok("Đã xóa (số lượng về 0)");
            }
            return ResponseEntity.ok(updatedItem);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/item/{itemId}/variant")
    public ResponseEntity<?> updateItemVariant(
            @PathVariable Long itemId,
            @RequestBody UpdateVariantRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) return ResponseEntity.status(401).body("Yêu cầu đăng nhập");
        try {
            CartItemDto updatedItem = cartService.updateCartItemVariant(itemId, request, userDetails.getUsername());
            return ResponseEntity.ok(updatedItem);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
      

}