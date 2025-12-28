package com.rentzy.backend.service;

import com.rentzy.backend.dto.AddressRequest;
import com.rentzy.backend.exception.NotFoundException;
import com.rentzy.backend.model.Address;
import com.rentzy.backend.model.User;
import com.rentzy.backend.repository.AddressRepository;
import com.rentzy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public List<Address> getMyAddresses(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found"));
        return addressRepository.findByUserId(user.getId());
    }

    @Transactional
    public Address addAddress(String username, AddressRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found"));

        // Nếu đặt làm mặc định, bỏ mặc định các cái cũ
        if (request.isDefault()) {
            List<Address> others = addressRepository.findByUserId(user.getId());
            others.forEach(a -> a.setDefault(false));
            addressRepository.saveAll(others);
        }

        Address address = Address.builder()
                .user(user)
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .city(request.getCity())
                .district(request.getDistrict())
                .ward(request.getWard())
                .streetAddress(request.getStreetAddress())
                .isDefault(request.isDefault())
                .build();
        return addressRepository.save(address);
    }

    @Transactional
    public Address updateAddress(Long addressId, String username, AddressRequest request) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new NotFoundException("Address not found"));
        
        if (!address.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("Unauthorized");
        }

        if (request.isDefault()) {
            List<Address> others = addressRepository.findByUserId(user.getId());
            others.forEach(a -> a.setDefault(false));
            addressRepository.saveAll(others);
        }

        address.setFullName(request.getFullName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setCity(request.getCity());
        address.setDistrict(request.getDistrict());
        address.setWard(request.getWard());
        address.setStreetAddress(request.getStreetAddress());
        address.setDefault(request.isDefault());

        return addressRepository.save(address);
    }

    @Transactional
    public void deleteAddress(Long addressId, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new NotFoundException("Address not found"));
        
        if (!address.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("Unauthorized");
        }
        addressRepository.delete(address);
    }
}