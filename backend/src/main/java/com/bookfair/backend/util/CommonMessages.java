package com.bookfair.backend.util;

public class CommonMessages {

    // User
    public static final String USER_NOT_FOUND = "User not found";
    public static final String EMAIL_ALREADY_EXISTS = "Email already exists";
    public static final String INVALID_EMAIL_OR_PASSWORD = "Invalid email or password";
    public static final String VENDOR_NOT_FOUND = "Vendor not found";

    // Stall
    public static final String STALL_CODE_ALREADY_EXISTS = "Stall already exists";
    public static final String STALL_NOT_FOUND = "Stall not found";
    public static final String STALL_NOT_AVAILABLE = "Stall is not available";
    public static final String MAX_STALLS_EXCEEDED = "Maximum 3 stalls allowed per reservation";

    // Reservation
    public static final String RESERVATION_NOT_FOUND = "Reservation not found";
    public static final String PAYMENT_ALREADY_EXISTS = "Payment already exists for this reservation";
    public static final String QR_CODE_ONLY_FOR_CONFIRMED = "QR Code available only for CONFIRMED reservations.";
    public static final String QR_CODE_GENERATION_FAILED = "Error generating QR code";

    // Payment
    public static final String PAYMENT_NOT_FOUND = "Payments not found";
    public static final String PAYMENT_CONFIRMATION_REQUIRED = "Only cash payments require confirmation";
    public static final String PAYMENT_PROVIDER_NOT_FOUND = "Payment provider not found";

    // Genre
    public static final String GENRE_ALREADY_EXISTS = "Genre already exists for this vendor";
    public static final String GENRE_NAME_ALREADY_EXISTS = "Genre name already exists";
    public static final String GENRE_NOT_FOUND = "Genre not found";
    public static final String UNAUTHORIZED_ACCESS = "Unauthorized to update this genre";

    // Deletion Guardrails
    public static final String VENDOR_HAS_PENDING_PAYMENTS = "Can't delete vendor. There are pending payments or active stalls.";
    public static final String PAYMENT_ALREADY_SUCCESSFUL = "Can't delete pending payments.";
    public static final String STALL_IN_ACTIVE_RESERVATION = "Can't delete active reservations.";

}
