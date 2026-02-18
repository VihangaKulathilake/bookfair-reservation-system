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
import com.bookfair.backend.service.QrCodeService;
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

    private final QrCodeService qrCodeService;

    @Transactional
    @Override
    public ReservationResponse createReservation(ReservationRequest reservationRequest) {

        User user = userRepository.findById(reservationRequest.getUserId())
                .orElseThrow(() -> new RuntimeException(CommonMessages.USER_NOT_FOUND));

        List<Reservation> userReservations = reservationRepository.findByUserId(user.getId());
        long activeStallsCount = userReservations.stream()
                .filter(r -> r.getReservationStatus() != ReservationStatus.CANCELLED)
                .mapToLong(r -> r.getStalls().size())
                .sum();

        if (activeStallsCount + reservationRequest.getStallIds().size() > 3) {
            throw new RuntimeException(CommonMessages.MAX_STALLS_EXCEEDED);
        }

        List<Stall> stalls = stallRepository.findAllById(reservationRequest.getStallIds());

        if (stalls.size() != reservationRequest.getStallIds().size()) {
            throw new RuntimeException(CommonMessages.STALL_NOT_FOUND);
        }

        if (stalls.size() > 3) {
            throw new RuntimeException(CommonMessages.MAX_STALLS_EXCEEDED);
        }

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
    @Transactional
    public ReservationResponse cancelReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException(CommonMessages.RESERVATION_NOT_FOUND));

        reservation.setReservationStatus(ReservationStatus.CANCELLED);

        for (Stall stall : reservation.getStalls()) {
            stall.setReservation(null);
            stall.setStallStatus(StallStatus.AVAILABLE);
        }
        stallRepository.saveAll(reservation.getStalls());
        return mapToResponse(reservationRepository.save(reservation));
    }

    @Override
    public ReservationResponse updateReservationStatus(Long id, String status) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(CommonMessages.RESERVATION_NOT_FOUND));

        try {
            ReservationStatus newStatus = ReservationStatus.valueOf(status.toUpperCase());
            reservation.setReservationStatus(newStatus);

            if (newStatus == ReservationStatus.CANCELLED) {
                return cancelReservation(id);
            }

        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status");
        }

        return mapToResponse(reservationRepository.save(reservation));
    }

    @Override
    public void deleteReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(CommonMessages.RESERVATION_NOT_FOUND));

        for (Stall stall : reservation.getStalls()) {
            stall.setReservation(null);
            stall.setStallStatus(StallStatus.AVAILABLE);
        }
        stallRepository.saveAll(reservation.getStalls());

        reservationRepository.deleteById(id);
    }

    @Override
    public byte[] generateQrCode(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException(CommonMessages.RESERVATION_NOT_FOUND));

        if (reservation.getReservationStatus() != ReservationStatus.CONFIRMED) {
            throw new RuntimeException(CommonMessages.QR_CODE_ONLY_FOR_CONFIRMED);
        }

        String content = "Reservation ID: " + reservation.getId() +
                "\nUser: " + reservation.getUser().getEmail() +
                "\nStalls: "
                + reservation.getStalls().stream().map(Stall::getStallCode).collect(Collectors.joining(", "));

        return qrCodeService.generateQrCode(content, 300, 300);
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
