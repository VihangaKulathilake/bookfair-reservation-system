import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { Box, Typography, Button, CircularProgress, Card, CardContent, Fade } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import UserNavbar from '../../components/layout/UserNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import { getStoredAuth } from '../../api/dashboardApi';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('Confirming your payment...');
    const user = getStoredAuth();
    const processed = useRef(false);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    useEffect(() => {
        const confirmPayment = async () => {
            const token = searchParams.get('token');
            const payerId = searchParams.get('PayerID'); // PayPal sends PayerID
            const reservationId = searchParams.get('reservationId');

            if (!token || !reservationId) {
                setStatus('error');
                setMessage('Invalid payment link. Missing information.');
                return;
            }

            // Prevent double execution
            if (processed.current) return;
            processed.current = true;

            try {
                // Call backend to confirm payment
                const response = await client.post('/payments/confirm', {
                    referenceId: token, // logic in backend uses token/orderId as reference
                    paymentMethod: 'PAYPAL',
                    reservationId: parseInt(reservationId)
                });

                if (response.status === 200 || response.data.paymentStatus === 'SUCCESS') {
                    setStatus('success');
                    setMessage('Payment successful! Your reservation is confirmed.');
                } else {
                    setStatus('error');
                    setMessage('Payment verification failed. Please contact support.');
                }
            } catch (error) {
                console.error('Payment confirmation error:', error);

                // If it's a duplicate entry error, we might want to check the status or treat as success if checking status
                // But generally, the backend fix (idempotency) should handle this. 
                // However, if the backend returns the existing payment, we assume success.
                // If error persists, it's a real error.

                setStatus('error');
                setMessage(error.response?.data?.message || 'An error occurred while confirming payment.');
            }
        };

        confirmPayment();
    }, [searchParams]);

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f4f6f8' }}>
            <UserNavbar userName={user?.businessName || 'User'} onLogout={handleLogout} />

            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
                <Fade in={true}>
                    <Card sx={{ maxWidth: 500, width: '100%', textAlign: 'center', p: 3, boxShadow: 3 }}>
                        <CardContent>
                            {status === 'loading' && (
                                <Box>
                                    <CircularProgress size={60} sx={{ mb: 3 }} />
                                    <Typography variant="h5" color="textSecondary">
                                        Processing Payment...
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                        Please wait while we confirm your reservation.
                                    </Typography>
                                </Box>
                            )}

                            {status === 'success' && (
                                <Box>
                                    <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                                    <Typography variant="h4" gutterBottom>
                                        Payment Successful!
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary" paragraph>
                                        {message}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 3, bgcolor: '#e8f5e9', p: 1, borderRadius: 1, color: 'success.main' }}>
                                        A QR Code has been sent to your email.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        onClick={() => navigate('/user/dashboard')}
                                    >
                                        Go to Dashboard
                                    </Button>
                                </Box>
                            )}

                            {status === 'error' && (
                                <Box>
                                    <ErrorOutlineIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
                                    <Typography variant="h4" color="error" gutterBottom>
                                        Payment Failed
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary" paragraph>
                                        {message}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => navigate('/user/dashboard')}
                                        sx={{ mt: 2 }}
                                    >
                                        Return to Dashboard
                                    </Button>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Fade>
            </Box>
            <SiteFooter />
        </Box>
    );
};

export default PaymentSuccess;
