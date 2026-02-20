import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import UserNavbar from '../../components/layout/UserNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import { getStoredAuth } from '../../api/dashboardApi';

const PaymentCancel = () => {
    const navigate = useNavigate();
    const user = getStoredAuth();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f4f6f8' }}>
            <UserNavbar userName={user?.businessName || 'User'} onLogout={handleLogout} />
            <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 5 }}>
                <Paper elevation={3} sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
                    <CancelIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
                    <Typography variant="h4" gutterBottom color="error.main">
                        Payment Cancelled
                    </Typography>
                    <Typography variant="body1" paragraph color="text.secondary">
                        You have cancelled the payment process. No charges were made.
                    </Typography>
                    <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => navigate('/user/dashboard')}
                        >
                            Back to Dashboard
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/user/stall-reservation')}
                        >
                            Try Again
                        </Button>
                    </Box>
                </Paper>
            </Container>
            <SiteFooter />
        </Box>
    );
};

export default PaymentCancel;
