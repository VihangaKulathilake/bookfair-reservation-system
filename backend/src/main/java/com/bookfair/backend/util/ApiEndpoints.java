package com.bookfair.backend.util;
public final class ApiEndpoints {

    private ApiEndpoints() {} // Prevent instantiation

    // ===================== AUTH =====================
    public static final String AUTH_BASE = "/api/auth";
    public static final String REGISTER = "/register";
    public static final String LOGIN = "/login";

    // ===================== USERS =====================
    public static final String USER_BASE = "/api/users";
    public static final String GET_ALL_USERS = "/all";
    public static final String GET_USER_BY_ID = "/{id}";
    public static final String UPDATE_USER = "/update/{id}";
    public static final String DELETE_USER = "/delete/{id}";

    // ===================== RESERVATIONS =====================
    public static final String RESERVATION_BASE = "/api/reservations";
    public static final String GET_ALL_RESERVATIONS = "/all";
    public static final String GET_RESERVATION_BY_ID = "/{id}";
    public static final String CREATE_RESERVATION = "/create";
    public static final String CANCEL_RESERVATION = "/cancel/{id}";

    // ===================== STALLS =====================
    public static final String STALL_BASE = "/api/stalls";
    public static final String GET_ALL_STALLS = "/all";
    public static final String GET_STALL_BY_ID = "/{id}";
    public static final String UPDATE_STALL = "/update/{id}";
    public static final String DELETE_STALL = "/delete/{id}";
}
