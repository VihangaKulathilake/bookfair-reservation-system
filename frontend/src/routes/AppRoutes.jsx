import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/common/Login';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Redirect root to login for now */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
};

export default AppRoutes;
