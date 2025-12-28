package com.rentzy.backend.controller;

import com.rentzy.backend.dto.AddressRequest;
import com.rentzy.backend.model.Address;
import com.rentzy.backend.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/addresses")
@RequiredArgsConstructor
public class AddressController {
    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<List<Address>> getMyAddresses(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(addressService.getMyAddresses(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<Address> addAddress(
            @RequestBody AddressRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(addressService.addAddress(userDetails.getUsername(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(
            @PathVariable Long id,
            @RequestBody AddressRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(addressService.updateAddress(id, userDetails.getUsername(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAddress(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        addressService.deleteAddress(id, userDetails.getUsername());
        return ResponseEntity.ok("Deleted");
    }
}