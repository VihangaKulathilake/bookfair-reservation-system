package com.bookfair.backend.service;

import com.bookfair.backend.model.User;
import com.bookfair.backend.enums.Role;
import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> getAllVendors();

    User getVendorById(Long id);

    User updateVendor(Long id, User userDetails);

    User getUserById(Long id);

    User updateUser(Long id, User userDetails);

    void deleteVendor(Long id);

    User getUserByEmail(String email);
}
