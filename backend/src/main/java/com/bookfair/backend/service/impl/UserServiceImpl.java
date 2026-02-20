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
    private final com.bookfair.backend.repository.GenreRepository genreRepository;

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
        // Legacy support, verifying role
        getVendorById(id);
        return updateUser(id, userDetails);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    @Transactional
    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);

        if (userDetails.getBusinessName() != null) user.setBusinessName(userDetails.getBusinessName());
        if (userDetails.getEmail() != null) user.setEmail(userDetails.getEmail());
        if (userDetails.getContactNumber() != null) user.setContactNumber(userDetails.getContactNumber());
        if (userDetails.getAddress() != null) user.setAddress(userDetails.getAddress());
        if (userDetails.getContactPerson() != null) user.setContactPerson(userDetails.getContactPerson());

        return userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteVendor(Long id) {
        User user = getVendorById(id);

        // Fetch all reservations for this user
        List<Reservation> reservations = reservationRepository.findByUserId(id);

        // [STRICT GUARDRAIL] Block deletion if there are ANY confirmed or pending payments
        boolean hasActiveFinancials = reservations.stream()
                .anyMatch(res -> res.getPayment() != null && 
                    (res.getPayment().getPaymentStatus() == com.bookfair.backend.enums.PaymentStatus.PENDING ||
                     res.getPayment().getPaymentStatus() == com.bookfair.backend.enums.PaymentStatus.SUCCESS));

        if (hasActiveFinancials) {
            throw new RuntimeException(CommonMessages.VENDOR_HAS_PENDING_PAYMENTS);
        }

        // [STRICT GUARDRAIL] Block deletion if there are ANY non-cancelled reservations
        boolean hasActiveReservations = reservations.stream()
                .anyMatch(res -> res.getReservationStatus() != com.bookfair.backend.enums.ReservationStatus.CANCELLED);
        
        if (hasActiveReservations) {
            // Even if payments are not present, active stalls should be cancelled first
            throw new RuntimeException("Can't delete vendor. Please cancel all active reservations first.");
        }

        // 1. Cleanup Genres
        genreRepository.deleteByUserId(id);

        // 2. Cleanup Reservations
        // Since we checked for active ones above, these are likely all cancelled or empty
        // We delete them to avoid foreign key violations when the user is deleted
        for (Reservation reservation : reservations) {
            reservationRepository.delete(reservation);
        }

        // 3. Delete the User
        userRepository.delete(user);
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
}
