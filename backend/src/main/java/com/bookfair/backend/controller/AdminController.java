package com.bookfair.backend.controller;

import com.bookfair.backend.model.User;
import com.bookfair.backend.service.UserService;
import com.bookfair.backend.util.ApiEndpoints;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiEndpoints.ADMIN_BASE)
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminController {

    private final UserService userService;

    // Manage Vendors
    @GetMapping(ApiEndpoints.GET_ALL_VENDORS)
    public ResponseEntity<List<User>> getAllVendors() {
        return ResponseEntity.ok(userService.getAllVendors());
    }

    @GetMapping(ApiEndpoints.GET_ALL_VENDORS_BY_ID)
    public ResponseEntity<User> getVendorById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getVendorById(id));
    }

    @PutMapping(ApiEndpoints.UPDATE_VENDOR)
    public ResponseEntity<User> updateVendor(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(userService.updateVendor(id, user));
    }

    @DeleteMapping(ApiEndpoints.DELETE_VENDOR)
    public ResponseEntity<Void> deleteVendor(@PathVariable Long id) {
        userService.deleteVendor(id);
        return ResponseEntity.noContent().build();
    }
}
