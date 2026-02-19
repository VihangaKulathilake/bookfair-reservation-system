import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminVendors from '../pages/admin/AdminVendors';
import AdminReservations from '../pages/admin/AdminReservations';
import AdminPayments from '../pages/admin/AdminPayments';
import AdminGenres from '../pages/admin/AdminGenres';

import UserDashboard from '../pages/user/UserDashboard';
import VendorStalls from '../pages/user/VendorStalls';
import VendorReservations from '../pages/user/VendorReservations';
import VendorGenres from '../pages/user/VendorGenres';
import { getStoredAuth } from '../api/dashboardApi';

const RequireRole = ({ expectedRole, children }) => {
    const user = getStoredAuth();

    if (!user?.role) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== expectedRole) {
        const destination = user.role === 'EMPLOYEE' ? '/admin' : '/vendor';
        return <Navigate to={destination} replace />;
    }

    return children;
};

const DashboardRedirect = () => {
    const user = getStoredAuth();
    if (!user?.role) {
        return <Navigate to="/login" replace />;
    }

    const destination = user.role === 'EMPLOYEE' ? '/admin' : '/vendor';
    return <Navigate to={destination} replace />;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<DashboardRedirect />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<RequireRole expectedRole="EMPLOYEE"><AdminDashboard /></RequireRole>} />
            <Route path="/admin/vendors" element={<RequireRole expectedRole="EMPLOYEE"><AdminVendors /></RequireRole>} />
            <Route path="/admin/reservations" element={<RequireRole expectedRole="EMPLOYEE"><AdminReservations /></RequireRole>} />
            <Route path="/admin/payments" element={<RequireRole expectedRole="EMPLOYEE"><AdminPayments /></RequireRole>} />
            <Route path="/admin/genres" element={<RequireRole expectedRole="EMPLOYEE"><AdminGenres /></RequireRole>} />

            {/* Vendor Routes */}
            <Route path="/vendor" element={<RequireRole expectedRole="BUSINESS"><UserDashboard /></RequireRole>} />
            <Route path="/vendor/stalls" element={<RequireRole expectedRole="BUSINESS"><VendorStalls /></RequireRole>} />
            <Route path="/vendor/reservations" element={<RequireRole expectedRole="BUSINESS"><VendorReservations /></RequireRole>} />
            <Route path="/vendor/genres" element={<RequireRole expectedRole="BUSINESS"><VendorGenres /></RequireRole>} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
