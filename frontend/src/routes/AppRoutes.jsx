import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import StallSelection from '../pages/user/StallSelection';
import BookingConfirmation from '../pages/user/BookingConfirmation';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/stall-selection" element={<StallSelection />} />
            <Route path="/stall-reservation" element={<StallSelection />} />
            <Route path="/stallselection" element={<StallSelection />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        </Routes>
    );
};

export default AppRoutes;
