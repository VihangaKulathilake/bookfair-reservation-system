package com.bookfair.backend.service.impl;

import com.bookfair.backend.dto.reservation.ConfirmReservationRequest;
import com.bookfair.backend.dto.reservation.CreateReservationRequest;
import com.bookfair.backend.dto.reservation.ReservationResponse;
import com.bookfair.backend.dto.reservation.UpdateReservationRequest;
import com.bookfair.backend.model.entity.Reservation;
import com.bookfair.backend.model.entity.Stall;
import com.bookfair.backend.model.entity.User;
import com.bookfair.backend.model.enums.ReservationStatus;
import com.bookfair.backend.repository.ReservationRepository;
import com.bookfair.backend.repository.StallRepository;
import com.bookfair.backend.repository.UserRepository;
import com.bookfair.backend.service.EmailService;
import com.bookfair.backend.service.ReservationService;
import com.bookfair.backend.util.CommonMessages;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

        private final ReservationRepository reservationRepository;
        private final StallRepository stallRepository;
        private final UserRepository userRepository;
        private final EmailService emailService;

        @Override
        public Reservation createReservation(CreateReservationRequest request, String userEmail) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException(CommonMessages.USER_NOT_FOUND));
                Stall stall = stallRepository.findById(request.getStallId())
                                .orElseThrow(() -> new RuntimeException(CommonMessages.STALL_NOT_FOUND));

                Reservation reservation = new Reservation();
                reservation.setUser(user);
                reservation.setStall(stall);
                reservation.setReservationDate(request.getReservationDate());
                reservation.setStatus(ReservationStatus.PENDING.name());

                Reservation savedReservation = reservationRepository.save(reservation);

                emailService.sendEmail(userEmail, "Reservation Created",
                                "Your reservation for stall " + stall.getName() + " is pending approval.");

                return savedReservation;
        }

        @Override
        public List<ReservationResponse> getMyReservations(String userEmail) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException(CommonMessages.USER_NOT_FOUND));
                return reservationRepository.findByUserId(user.getId()).stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public List<ReservationResponse> getAllReservations() {
                return reservationRepository.findAll().stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public ReservationResponse getReservationById(Long id) {
                Reservation reservation = reservationRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException(CommonMessages.RESERVATION_NOT_FOUND));
                return mapToResponse(reservation);
        }

        @Override
        public Reservation confirmReservation(ConfirmReservationRequest request) {
                Reservation reservation = reservationRepository.findById(request.getReservationId())
                                .orElseThrow(() -> new RuntimeException(CommonMessages.RESERVATION_NOT_FOUND));

                ReservationStatus status = request.isConfirmed() ? ReservationStatus.CONFIRMED
                                : ReservationStatus.REJECTED;
                reservation.setStatus(status.name());

                Reservation savedReservation = reservationRepository.save(reservation);

                emailService.sendEmail(reservation.getUser().getEmail(), "Reservation Update",
                                "Your reservation status has been updated to: " + status);

                return savedReservation;
        }

        @Override
        public boolean deleteReservation(Long id) {
                if (!reservationRepository.existsById(id)) {
                        throw new RuntimeException(CommonMessages.RESERVATION_NOT_FOUND);
                }
                reservationRepository.deleteById(id);
                return true;
        }

        @Override
        public Reservation updateReservation(Long id, UpdateReservationRequest request) {
                Reservation reservation = reservationRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException(CommonMessages.RESERVATION_NOT_FOUND));

                if (request.getStallId() != null) {
                        Stall stall = stallRepository.findById(request.getStallId())
                                        .orElseThrow(() -> new RuntimeException(CommonMessages.STALL_NOT_FOUND));
                        reservation.setStall(stall);
                }

                if (request.getReservationDate() != null) {
                        reservation.setReservationDate(request.getReservationDate());
                }

                if (request.getStatus() != null) {
                        reservation.setStatus(request.getStatus().name());
                        emailService.sendEmail(reservation.getUser().getEmail(), "Reservation Update",
                                        "Your reservation status has been updated to: " + request.getStatus().name());
                }

                return reservationRepository.save(reservation);
        }

        private ReservationResponse mapToResponse(Reservation reservation) {
                return ReservationResponse.builder()
                                .id(reservation.getId())
                                .userId(reservation.getUser().getId())
                                .userName(reservation.getUser().getEmail())
                                .stallId(reservation.getStall().getId())
                                .stallName(reservation.getStall().getName())
                                .reservationDate(reservation.getReservationDate())
                                .status(reservation.getStatus())
                                .build();
        }
}
