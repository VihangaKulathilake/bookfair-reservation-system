package com.bookfair.backend.util;
public final class ApiEndpoints {

    private ApiEndpoints() {} // Prevent instantiation

    // ===================== AUTH =====================
    public static final String AUTH_BASE = "/api/auth";
    public static final String REGISTER = "/register";
    public static final String LOGIN = "/login";

    // ===================== USERS =====================
    public static final String ADMIN_BASE = "/api/admin";
    public static final String GET_ALL_VENDORS = "/vendors";
    public static final String GET_ALL_VENDORS_BY_ID = "/vendors/{id}";
    public static final String UPDATE_VENDOR = "/vendors/{id}";
    public static final String DELETE_VENDOR = "/vendors/{id}";
    public static final String USER_BASE = "/api/users";
    public static final String GET_USER_BY_ID = "/{id}";
    public static final String GET_USER_BY_EMAIL = "/by-email";
    public static final String UPDATE_USER = "/{id}";

    // ===================== RESERVATIONS =====================
    public static final String RESERVATION_BASE = "/api/reservations";
    public static final String GET_ALL_RESERVATIONS = "/all";
    public static final String GET_RESERVATION_BY_ID = "/{id}";
    public static final String CREATE_RESERVATION = "/create";
    public static final String CANCEL_RESERVATION = "/cancel/{id}";
    public static final String GET_RESERVATION_BY_USER_ID = "/user/{id}";
    public static final String UPDATE_RESERVATION_STATUS = "/{id}/status";
    public static final String DELETE_RESERVATION = "/{id}";
    public static final String UPDATE_RESERVATION = "/{id}";
    public static final String GENERATE_QR = "/{id}/qr";


    // ===================== STALLS =====================
    public static final String STALL_BASE = "/api/stalls";
    public static final String CREATE_STALL = "/create";
    public static final String GET_ALL_STALLS = "/all";
    public static final String GET_AVAILABLE_STALLS = "/available";
    public static final String GET_STALLS_BY_SIZE = "/size/{size}";
    public static final String GET_STALL_BY_ID = "/{id}";
    public static final String UPDATE_STALL = "/update/{id}";
    public static final String DELETE_STALL = "/delete/{id}";

    // ===================== PAYMENTS =====================
    public static final String PAYMENT_BASE = "/api/payments";
    public static final String PROCESS_PAYMENT = "/process";
    public static final String CONFIRM_PAYMENT = "/confirm";
    public static final String CONFIRM_CASH_PAYMENT = "/{paymentId}/confirm";
    public static final String GET_PAYMENT_BY_ID = "/{paymentId}";
    public static final String GET_ALL_PAYMENTS = "/all";
    public static final String GET_PAYMENTS_BY_USER_ID = "/{userId}";
    public static final String UPDATE_PAYMENT = "/{id}";
    public static final String DELETE_PAYMENT = "/{id}";

    
    // ===================== GENRES =====================
    public static final String GENRE_BASE = "/api/vendor/genres";
    public static final String CREATE_GENRE = "/create";
    public static final String GET_ALL_GENRES = "/all";
    public static final String UPDATE_GENRE = "/{id}";
    public static final String DELETE_GENRE = "/{id}";

    // ======================== QR ========================
    public static final String QR_BASE = "/api/qr";
    public static final String VERIFY_QR = "/verify";
}
