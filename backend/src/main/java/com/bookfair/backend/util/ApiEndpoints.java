package com.bookfair.backend.util;
public final class ApiEndpoints {

    private ApiEndpoints() {} // Prevent instantiation

    // ===================== AUTH =====================
    public static final String AUTH_BASE = "/api/auth";
    public static final String REGISTER = AUTH_BASE + "/register";
    public static final String LOGIN = AUTH_BASE + "/login";

    // ===================== USERS =====================
    public static final String USER_BASE = "/api/users";
    public static final String GET_ALL_USERS = USER_BASE + "/all";
    public static final String GET_USER_BY_ID = USER_BASE + "/{id}";
    public static final String UPDATE_USER = USER_BASE + "/update/{id}";
    public static final String DELETE_USER = USER_BASE + "/delete/{id}";

    // ===================== RESERVATIONS =====================
    public static final String RESERVATION_BASE = "/api/reservations";
    public static final String GET_ALL_RESERVATIONS = RESERVATION_BASE + "/all";
    public static final String GET_RESERVATION_BY_ID = RESERVATION_BASE + "/{id}";
    public static final String CREATE_RESERVATION = RESERVATION_BASE + "/create";
    public static final String CANCEL_RESERVATION = RESERVATION_BASE + "/cancel/{id}";

    // ===================== STALLS =====================
    public static final String STALL_BASE = "/api/stalls";
    public static final String GET_ALL_STALLS = STALL_BASE + "/all";
    public static final String GET_STALL_BY_ID = STALL_BASE + "/{id}";
    public static final String UPDATE_STALL = STALL_BASE + "/update/{id}";
    public static final String DELETE_STALL = STALL_BASE + "/delete/{id}";
}
