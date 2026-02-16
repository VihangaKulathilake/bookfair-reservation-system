package com.bookfair.backend.service.impl;

import com.bookfair.backend.dto.ReservationRequest;
import com.bookfair.backend.dto.ReservationResponse;
import com.bookfair.backend.enums.ReservationStatus;
import com.bookfair.backend.enums.StallStatus;
import com.bookfair.backend.model.Reservation;
import com.bookfair.backend.model.Stall;
import com.bookfair.backend.model.User;
import com.bookfair.backend.repository.ReservationRepository;
import com.bookfair.backend.repository.StallRepository;
import com.bookfair.backend.repository.UserRepository;
import com.bookfair.backend.service.ReservationService;
import com.bookfair.backend.util.CommonMessages;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;
    private final StallRepository stallRepository;

    @Transactional
    @Override
    public ReservationResponse createReservation(ReservationRequest reservationRequest) {

        User user = userRepository.findById(reservationRequest.getUserId())
                .orElseThrow(() -> new RuntimeException(CommonMessages.USER_NOT_FOUND));

        List<Stall> stalls = stallRepository.findAllById(reservationRequest.getStallIds());

        if (stalls.size() != reservationRequest.getStallIds().size()) {
            throw new RuntimeException(CommonMessages.STALL_NOT_FOUND);
        }

        if (stalls.size() > 3) {
            throw new RuntimeException(CommonMessages.MAX_STALLS_EXCEEDED);
        }

        // Check availability
        for (Stall stall : stalls) {
            if (stall.getStallStatus() != StallStatus.AVAILABLE) {
                throw new RuntimeException(CommonMessages.STALL_NOT_AVAILABLE);
            }
        }

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setReservationDate(LocalDateTime.now());
        reservation.setReservationStatus(ReservationStatus.PENDING);

        Reservation savedReservation = reservationRepository.save(reservation);

        double totalAmount = 0;

        for (Stall stall : stalls) {

            stall.setReservation(savedReservation);
            stall.setStallStatus(StallStatus.RESERVED);

            totalAmount += stall.getPrice();
        }

        savedReservation.setTotalAmount(totalAmount);

        stallRepository.saveAll(stalls);
        reservationRepository.save(savedReservation);

        return mapToResponse(savedReservation);
    }

    @Override
    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReservationResponse> getReservationByUserId(Long userId) {
        return reservationRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ReservationResponse getReservationById(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException(CommonMessages.RESERVATION_NOT_FOUND));
        return mapToResponse(reservation);
    }

    @Override
    public ReservationResponse cancelReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException(CommonMessages.RESERVATION_NOT_FOUND));

        reservation.setReservationStatus(ReservationStatus.CANCELLED);

        for (Stall stall : reservation.getStalls()) {
            stall.setReservation(null);
            stall.setStallStatus(StallStatus.AVAILABLE);
        }

        stallRepository.saveAll(reservation.getStalls());
        reservationRepository.save(reservation);

        return mapToResponse(reservation);
    }

    private ReservationResponse mapToResponse(Reservation reservation) {

        List<String> stallCodes = reservation.getStalls()
                .stream()
                .map(Stall::getStallCode)
                .toList();

        return ReservationResponse.builder()
                .reservationId(reservation.getId())
                .userId(reservation.getUser().getId())
                .stallCodes(stallCodes)
                .reservationDate(reservation.getReservationDate())
                .reservationStatus(reservation.getReservationStatus())
                .build();
    }
}
