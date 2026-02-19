import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, Button, Container, useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/layout/NavBar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import { Storefront, Event, Payments, Category } from '@mui/icons-material';
import {
    getStoredAuth,
    getAvailableStalls,
    getReservationsByUserId,
    getPaymentsByUserId,
    getGenresByVendor
} from '../../api/dashboardApi';

const UserDashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const user = getStoredAuth();
    const [stats, setStats] = useState({ stalls: 0, reservations: 0, payments: 0, genres: 0 });

    useEffect(() => {
        if (user) {
            fetchStats();
        }
    }, []);

    const fetchStats = async () => {
        try {
            const [stallsData, reservationsData, paymentsData, genresData] = await Promise.all([
                getAvailableStalls(),
                getReservationsByUserId(user.userId),
                getPaymentsByUserId(user.userId),
                getGenresByVendor(user.email)
            ]);

            setStats({
                stalls: Array.isArray(stallsData) ? stallsData.length : 0,
                reservations: Array.isArray(reservationsData) ? reservationsData.length : 0,
                payments: Array.isArray(paymentsData) ? paymentsData.filter(p => !p.confirmed).length : 0, // Assuming we want pending payments? Or all? Screenshot says "0 PAYMENTS". Let's show total for now or pending.
                genres: Array.isArray(genresData) ? genresData.length : 0
            });
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const overviewItems = [
        { title: 'AVAILABLE STALLS', count: stats.stalls, icon: <Storefront fontSize="large" />, color: '#E3F2FD', iconColor: '#1565C0' },
        { title: 'MY RESERVATIONS', count: stats.reservations, icon: <Event fontSize="large" />, color: '#FFF3E0', iconColor: '#EF6C00' },
        { title: 'PAYMENTS', count: stats.payments, icon: <Payments fontSize="large" />, color: '#E8F5E9', iconColor: '#2E7D32' },
        { title: 'MY GENRES', count: stats.genres, icon: <Category fontSize="large" />, color: '#E1F5FE', iconColor: '#0277BD' }
    ];

    const menuItems = [
        { title: 'Reserve Stalls', description: 'View available stalls and make reservations', path: '/vendor/stalls', buttonText: 'Reserve Stalls', icon: <Storefront fontSize="large" />, color: '#E3F2FD', iconColor: '#1565C0' },
        { title: 'My Reservations', description: 'View and manage your reservations', path: '/vendor/reservations', buttonText: 'View Reservations', icon: <Event fontSize="large" />, color: '#FFF3E0', iconColor: '#EF6C00' },
        { title: 'Manage Genres', description: 'Add, edit, or delete your book genres', path: '/vendor/genres', buttonText: 'Manage Genres', icon: <Category fontSize="large" />, color: '#E1F5FE', iconColor: '#0277BD' }
    ];

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F5F7FA' }}>
            <NavBar role="vendor" userName={user?.businessName || 'Vendor'} onLogout={handleLogout} />

            {/* Welcome Banner */}
            <Box sx={{
                mx: 3, mt: 4, mb: 4, p: 4,
                borderRadius: 4,
                background: 'linear-gradient(90deg, #0D47A1 0%, #1976D2 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>Vendor Dashboard</Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>Welcome back, {user?.businessName || 'Vendor'}</Typography>
                </Box>
                {/* Abstract Shapes for decoration */}
                <Box sx={{
                    position: 'absolute', right: -50, top: -50, width: 300, height: 300,
                    borderRadius: '50%', background: 'rgba(255,255,255,0.1)'
                }} />
                <Box sx={{
                    position: 'absolute', right: 150, bottom: -100, width: 200, height: 200,
                    borderRadius: '50%', background: 'rgba(255,255,255,0.05)'
                }} />
            </Box>

            <Container maxWidth="xl" sx={{ flexGrow: 1, mb: 4 }}>
                {/* Overview Section */}
                <Box mb={1} display="flex" alignItems="center" gap={1}>
                    <Typography variant="h5" fontWeight="bold" color="text.primary">
                        Overview
                    </Typography>
                </Box>

                <Grid container spacing={3} mb={6}>
                    {overviewItems.map((item, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                            <Card sx={{
                                bgcolor: item.color,
                                borderRadius: 3,
                                border: 'none',
                                boxShadow: 'none',
                                height: '100%'
                            }}>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: 3 }}>
                                    <Box sx={{
                                        bgcolor: 'white',
                                        p: 1.5,
                                        borderRadius: 2,
                                        color: item.iconColor,
                                        mb: 2,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                    }}>
                                        {item.icon}
                                    </Box>
                                    <Typography variant="h3" fontWeight="800" color="text.primary" sx={{ mb: 0.5 }}>
                                        {item.count}
                                    </Typography>
                                    <Typography variant="subtitle2" fontWeight="600" color="text.secondary" sx={{ letterSpacing: 1, opacity: 0.7 }}>
                                        {item.title}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Quick Actions Section */}
                <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
                    Quick Actions
                </Typography>
                <Grid container spacing={3}>
                    {menuItems.map((item, index) => (
                        <Grid size={{ xs: 12, md: 4 }} key={index}>
                            <Card sx={{
                                height: '100%',
                                borderRadius: 3,
                                transition: 'all 0.3s ease',
                                '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
                            }}>
                                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Box sx={{
                                            bgcolor: item.color,
                                            p: 1,
                                            borderRadius: 2,
                                            color: item.iconColor,
                                            mr: 2
                                        }}>
                                            {item.icon}
                                        </Box>
                                        <Typography variant="h6" fontWeight="bold">
                                            {item.title}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                                        {item.description}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        onClick={() => navigate(item.path)}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            borderWidth: 2,
                                            borderColor: item.iconColor,
                                            color: item.iconColor,
                                            '&:hover': { borderWidth: 2, borderColor: item.iconColor, bgcolor: item.color }
                                        }}
                                    >
                                        {item.buttonText}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <SiteFooter />
        </Box >
    );
};

export default UserDashboard;
