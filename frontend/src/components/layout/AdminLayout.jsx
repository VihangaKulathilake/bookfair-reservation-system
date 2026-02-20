import { useNavigate, Outlet } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';
import AdminNavbar from './AdminNavbar';
import { getStoredAuth } from '../../api/dashboardApi';
import { logoutUser } from '../../api/authApi';

const AdminLayout = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const user = getStoredAuth();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', bgcolor: theme.palette.background.default }}>
            <AdminNavbar
                userName={user?.contactPerson || user?.businessName || user?.email || 'Administrator'}
                onLogout={handleLogout}
            />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminLayout;
