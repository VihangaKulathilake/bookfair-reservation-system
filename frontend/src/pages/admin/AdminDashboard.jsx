import React, { useEffect, useState, useMemo } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, Button, Container, Chip, useTheme, alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/layout/NavBar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import {
    getAllPayments,
    getAllReservations,
    getStoredAuth,
    getVendors,
} from '../../api/dashboardApi';

import { People, EventNote, Payments, Category, RateReview } from '@mui/icons-material';

const AdminDashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ users: 0, reservations: 0, payments: 0, genres: 0 });
    const user = getStoredAuth();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [vendors, reservations, payments] = await Promise.all([
                getVendors(),
                getAllReservations(),
                getAllPayments()
            ]);

            setStats({
                users: Array.isArray(vendors) ? vendors.length : 0,
                reservations: Array.isArray(reservations) ? reservations.filter(r => r.status === 'PENDING').length : 0,
                payments: Array.isArray(payments) ? payments.filter(p => p.status === 'PENDING').length : 0,
                genres: 0 // Placeholder
            });
        } catch (error) {
            console.error("Failed to fetch stats");
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const overviewItems = [
        { title: 'TOTAL USERS', count: stats.users, icon: <People fontSize="large" />, color: '#EDE7F6', iconColor: '#5E35B1' },
        { title: 'PENDING RESERVATIONS', count: stats.reservations, icon: <EventNote fontSize="large" />, color: '#FFF3E0', iconColor: '#EF6C00' },
        { title: 'PENDING PAYMENTS', count: stats.payments, icon: <Payments fontSize="large" />, color: '#E8F5E9', iconColor: '#2E7D32' },
        { title: 'GENRES', count: stats.genres, icon: <Category fontSize="large" />, color: '#E1F5FE', iconColor: '#0277BD' }
    ];

    const menuItems = [
        { title: 'Manage Users', description: 'View, Update, Delete Vendors', path: '/admin/vendors', buttonText: 'Manage Users', icon: <People fontSize="large" />, color: '#EDE7F6', iconColor: '#5E35B1' },
        { title: 'Review Reservations', description: 'Approve, Reject, Delete', path: '/admin/reservations', buttonText: 'Review Reservations', icon: <RateReview fontSize="large" />, color: '#FFF3E0', iconColor: '#EF6C00' },
        { title: 'View Payments', description: 'Confirm Cash Payments', path: '/admin/payments', buttonText: 'View Payments', icon: <Payments fontSize="large" />, color: '#E8F5E9', iconColor: '#2E7D32' },
        { title: 'View Genres', description: 'View Genres by Vendor', path: '/admin/genres', buttonText: 'View Genres', icon: <Category fontSize="large" />, color: '#E1F5FE', iconColor: '#0277BD' }
    ];

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F5F7FA' }}>
            <NavBar role="admin" userName={user?.businessName || 'Admin'} onLogout={handleLogout} />

            {/* Welcome Banner */}
            <Box sx={{
                mx: 3, mt: 4, mb: 4, p: 4,
                borderRadius: 4,
                background: 'linear-gradient(90deg, #4A148C 0%, #7B1FA2 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>Admin Dashboard</Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>Welcome back, {user?.businessName || 'Admin'}</Typography>
                </Box>
                {/* Abstract Shapes */}
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
                        <Grid size={{ xs: 12, md: 6, lg: 3 }} key={index}>
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
        </Box>
    );
};

export default AdminDashboard;
