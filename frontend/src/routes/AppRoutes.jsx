import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';



// Public Pages
import LandingPage from '../pages/LandingPage';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// User Pages
import UserDashboard from '../pages/user/UserDashboard';
import ReservationWizard from '../pages/user/ReservationWizard';
import MyReservations from '../pages/user/MyReservations';
import UserProfile from '../pages/user/UserProfile';
import Settings from '../pages/user/Settings';
import StallSelection from '../pages/user/StallSelection';

// Admin Pages
// Vendor Pages
import VendorStalls from '../pages/user/VendorStalls';
import VendorReservations from '../pages/user/VendorReservations';
import VendorGenres from '../pages/user/VendorGenres';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageReservations from '../pages/admin/ManageReservations'; // Keeping for safety, but AdminReservations might replace it
import AdminReservations from '../pages/admin/AdminReservations';
import AdminVendors from '../pages/admin/AdminVendors';
import AdminPayments from '../pages/admin/AdminPayments';
import AdminGenres from '../pages/admin/AdminGenres';
import AdminStalls from '../pages/admin/AdminStalls';
import Reports from '../pages/admin/Reports';
import InsertStall from '../pages/admin/InsertStall';
import AdminProfile from '../pages/admin/AdminProfile';
import EditAdminProfile from '../pages/admin/EditAdminProfile';

import PaymentSuccess from '../pages/user/PaymentSuccess';
import PaymentCancel from '../pages/user/PaymentCancel';
import EditProfile from '../pages/user/EditProfile';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* User Routes */}
            <Route path="/user" element={<Navigate to="/user/dashboard" replace />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/reservations" element={<MyReservations />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/edit-profile" element={<EditProfile />} />
            <Route path="/user/settings" element={<Settings />} />
            <Route path="/user/stall-reservation" element={<ReservationWizard />} />
            <Route path="/user/stall-selection" element={<StallSelection />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />

            {/* User/Vendor Routes */}
            <Route path="/user/stalls" element={<VendorStalls />} />
            <Route path="/user/vendor-reservations" element={<MyReservations />} />
            <Route path="/user/genres" element={<VendorGenres />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/edit-profile" element={<EditAdminProfile />} />
            <Route path="/admin/reservations" element={<AdminReservations />} />
            <Route path="/admin/vendors" element={<AdminVendors />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/genres" element={<AdminGenres />} />
            <Route path="/admin/stalls" element={<AdminStalls />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/insert-stall" element={<InsertStall />} />

            {/* Legacy/Direct Access Redirects */}
            <Route path="/stall-reservation" element={<Navigate to="/user/stall-reservation" replace />} />
            <Route path="/my-reservations" element={<Navigate to="/user/reservations" replace />} />
            <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />

            {/* Catch all - 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
