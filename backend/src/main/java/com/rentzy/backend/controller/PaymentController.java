package com.rentzy.backend.controller;

import com.rentzy.backend.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // API: GET /api/v1/payment/create_payment?amount=100000
    @GetMapping("/create_payment")
    public ResponseEntity<?> createPayment(
            HttpServletRequest request,
            @RequestParam long amount
    ) {
        String orderInfo = "Thanh toan don hang Rentzy";
        String paymentUrl = paymentService.createVnPayPayment(request, amount, orderInfo);
        
        Map<String, String> response = new HashMap<>();
        response.put("paymentUrl", paymentUrl);
        
        return ResponseEntity.ok(response);
    }
}