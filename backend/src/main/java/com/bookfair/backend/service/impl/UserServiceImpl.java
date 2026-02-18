package com.bookfair.backend.service.impl;

import com.bookfair.backend.enums.Role;
import com.bookfair.backend.model.Reservation;
import com.bookfair.backend.model.User;
import com.bookfair.backend.repository.ReservationRepository;
import com.bookfair.backend.repository.UserRepository;
import com.bookfair.backend.service.ReservationService;
import com.bookfair.backend.service.UserService;
import com.bookfair.backend.util.CommonMessages;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ReservationService reservationService; // To cancel reservations
    private final ReservationRepository reservationRepository; // To find reservations

    @Override
    public List<User> getAllVendors() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.BUSINESS) // Assuming BUSINESS is vendor
                .collect(Collectors.toList());
    }

    @Override
    public User getVendorById(Long id) {
        return userRepository.findById(id)
                .filter(user -> user.getRole() == Role.BUSINESS)
                .orElseThrow(() -> new RuntimeException(CommonMessages.VENDOR_NOT_FOUND));
    }

    @Override
    @Transactional
    public User updateVendor(Long id, User userDetails) {
        User user = getVendorById(id);

        user.setBusinessName(userDetails.getBusinessName());
        user.setEmail(userDetails.getEmail());
        user.setContactNumber(userDetails.getContactNumber());
        // Password update logic if needed, skipping for now as not requested explicitly

        return userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteVendor(Long id) {
        User user = getVendorById(id);

        // Cancel active reservations
        List<Reservation> reservations = reservationRepository.findByUserId(id);
        for (Reservation reservation : reservations) {
            reservationService.cancelReservation(reservation.getId());
        }

        userRepository.delete(user);
    }
}
