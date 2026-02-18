// BookingConfirmation Page
import React from 'react';
import { Box, Typography, Button, Paper, Divider, Grid } from '@mui/material';
import { Download, Home, QrCode } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const BookingConfirmation = () => {
    const navigate = useNavigate();

    // demo booking details
    const bookingDetails = {
        id: 'BK-7829',
        stalls: ['A-12 (Small)', 'A-13 (Small)'],
        totalAmount: '$200',
        date: '2025-09-20',
        email: 'publisher@example.com'
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Reservation Confirmed!
                </Typography>
                <Typography variant="body1" paragraph>
                    Thank you for your reservation. A confirmation email has been sent to <b>{bookingDetails.email}</b>.
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3} sx={{ textAlign: 'left' }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Booking Details</Typography>
                        <Typography variant="body2" color="text.secondary">Booking ID:</Typography>
                        <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>{bookingDetails.id}</Typography>

                        <Typography variant="body2" color="text.secondary">Stalls Reserved:</Typography>
                        <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>{bookingDetails.stalls.join(', ')}</Typography>

                        <Typography variant="body2" color="text.secondary">Date:</Typography>
                        <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>{bookingDetails.date}</Typography>

                        <Typography variant="body2" color="text.secondary">Total Amount:</Typography>
                        <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>{bookingDetails.totalAmount}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ p: 2, border: '2px dashed #ccc', borderRadius: 2, mb: 1 }}>
                            <QrCode sx={{ fontSize: 100, color: 'text.primary' }} />
                        </Box>
                        <Typography variant="caption" color="text.secondary">Scan this QR at the entrance</Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button variant="outlined" startIcon={<Download />}>
                        Download Pass
                    </Button>
                    <Button variant="contained" startIcon={<Home />} onClick={() => navigate('/')}>
                        Go to Home
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default BookingConfirmation;
