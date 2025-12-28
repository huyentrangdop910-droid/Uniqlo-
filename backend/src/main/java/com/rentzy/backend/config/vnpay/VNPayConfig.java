package com.rentzy.backend.config.vnpay;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Configuration
public class VNPayConfig {
    @Getter
    @Value("${vnpay.payUrl}")
    private String vnp_PayUrl;
    @Getter
    @Value("${vnpay.returnUrl}")
    private String vnp_ReturnUrl;
    @Getter
    @Value("${vnpay.tmnCode}")
    private String vnp_TmnCode;
    @Getter
    @Value("${vnpay.secretKey}")
    private String secretKey;
    @Getter
    @Value("${vnpay.version}")
    private String vnp_Version;
    @Getter
    @Value("${vnpay.command}")
    private String vnp_Command;
    @Getter
    @Value("${vnpay.orderType}")
    private String orderType;

    // Hàm tiện ích: Lấy IP người dùng
    public static String getIpAddress(HttpServletRequest request) {
        String ipAdress;
        try {
            ipAdress = request.getHeader("X-FORWARDED-FOR");
            if (ipAdress == null) {
                ipAdress = request.getRemoteAddr();
            }
        } catch (Exception e) {
            ipAdress = "Invalid IP:" + e.getMessage();
        }
        return ipAdress;
    }

    // Hàm tiện ích: Tạo mã băm HMAC SHA512 (bắt buộc để bảo mật)
    public static String hmacSHA512(final String key, final String data) {
        try {
            if (key == null || data == null) {
                throw new NullPointerException();
            }
            final Mac hmac512 = Mac.getInstance("HmacSHA512");
            byte[] hmacKeyBytes = key.getBytes();
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA512");
            hmac512.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();

        } catch (Exception ex) {
            return "";
        }
    }
    
    // Hàm tiện ích: Random chuỗi số (để tạo mã giao dịch ngẫu nhiên)
    public static String getRandomNumber(int len) {
        Random rnd = new Random();
        String chars = "0123456789";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }
}