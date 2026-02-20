import React from 'react';
import { Typography, Box, useTheme, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/layout/AdminNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import { getStoredAuth } from '../../api/dashboardApi';

const Reports = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const user = getStoredAuth();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
            <AdminNavbar userName={user?.businessName || 'Admin'} onLogout={handleLogout} />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Container maxWidth="xl">
                    <Typography variant="h4" gutterBottom>
                        Reports
                    </Typography>
                    <Typography>Generation of financial and reservation reports will be here.</Typography>
                </Container>
            </Box>
            <SiteFooter />
        </Box>
    );
};

export default Reports;
