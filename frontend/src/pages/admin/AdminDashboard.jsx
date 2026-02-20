import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, Button, Container, useTheme, CircularProgress, alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminNavbar from '../../components/layout/AdminNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import {
    getAllPayments,
    getAllReservations,
    getStoredAuth,
    getVendors,
} from '../../api/dashboardApi';

import { People, EventNote, Payments, Category, RateReview, ArrowForward } from '@mui/icons-material';

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 100 }
    }
};

const AdminDashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ users: 0, reservations: 0, payments: 0, genres: 0 });
    const [loading, setLoading] = useState(true);
    const user = getStoredAuth();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const results = await Promise.allSettled([
                getVendors(),
                getAllReservations(),
                getAllPayments()
            ]);

            const vendorsData = results[0].status === 'fulfilled' ? results[0].value : [];
            const reservationsData = results[1].status === 'fulfilled' ? results[1].value : [];
            const paymentsData = results[2].status === 'fulfilled' ? results[2].value : [];

            // Log errors if any failed
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`Failed to fetch stats for index ${index}:`, result.reason);
                }
            });

            setStats({
                users: Array.isArray(vendorsData) ? vendorsData.length : 0,
                reservations: Array.isArray(reservationsData) ? reservationsData.filter(r => r.reservationStatus === 'PENDING').length : 0,
                payments: Array.isArray(paymentsData) ? paymentsData.filter(p => p.paymentStatus === 'PENDING').length : 0,
                genres: 0
            });

            // Fetch genres for count
            if (Array.isArray(vendorsData) && vendorsData.length > 0) {
                const genrePromises = vendorsData.map(v => getGenresByVendor(v.email).catch(() => []));
                const genresResults = await Promise.all(genrePromises);
                const totalGenres = genresResults.reduce((acc, curr) => acc + (Array.isArray(curr) ? curr.length : 0), 0);
                setStats(prev => ({ ...prev, genres: totalGenres }));
            }
        } catch (error) {
            console.error("Critical error in fetchStats:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const overviewItems = [
        { title: 'TOTAL USERS', count: stats.users, icon: <People fontSize="large" />, color: '#EDE7F6', iconColor: '#5E35B1', delay: 0 },
        { title: 'PENDING RESERVATIONS', count: stats.reservations, icon: <EventNote fontSize="large" />, color: '#FFF3E0', iconColor: '#EF6C00', delay: 0.1 },
        { title: 'PENDING PAYMENTS', count: stats.payments, icon: <Payments fontSize="large" />, color: '#E8F5E9', iconColor: '#2E7D32', delay: 0.2 },
        { title: 'GENRES', count: stats.genres, icon: <Category fontSize="large" />, color: '#E1F5FE', iconColor: '#0277BD', delay: 0.3 }
    ];

    const menuItems = [
        { title: 'Manage Users', description: 'View, Update, Delete Vendors', path: '/admin/vendors', buttonText: 'Manage Users', icon: <People fontSize="large" />, color: '#EDE7F6', iconColor: '#5E35B1' },
        { title: 'Review Reservations', description: 'Approve, Reject, Delete', path: '/admin/reservations', buttonText: 'Review Reservations', icon: <RateReview fontSize="large" />, color: '#FFF3E0', iconColor: '#EF6C00' },
        { title: 'View Payments', description: 'Confirm Cash Payments', path: '/admin/payments', buttonText: 'View Payments', icon: <Payments fontSize="large" />, color: '#E8F5E9', iconColor: '#2E7D32' },
        { title: 'View Genres', description: 'View Genres by Vendor', path: '/admin/genres', buttonText: 'View Genres', icon: <Category fontSize="large" />, color: '#E1F5FE', iconColor: '#0277BD' }
    ];

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F5F7FA' }}>
            <AdminNavbar userName={user?.contactPerson || user?.businessName || 'Admin'} onLogout={handleLogout} />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <CircularProgress size={60} thickness={4} />
                </Box>
            ) : (
                <>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Modern Welcome Banner */}
                        <Box sx={{
                            mx: { xs: 2, md: 4 }, mt: 4, mb: 4, p: { xs: 3, md: 5 },
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, #4A148C 0%, #7B1FA2 100%)',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 8px 32px rgba(74, 20, 140, 0.2)'
                        }}>
                            <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 'md' }}>
                                <Typography variant="h3" fontWeight="800" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
                                    Admin Dashboard
                                </Typography>
                                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500 }}>
                                    Welcome back, {user?.contactPerson || user?.businessName || 'Admin'}. Manage your book fair platform.
                                </Typography>
                            </Box>

                            {/* Decorative Elements */}
                            <Box sx={{
                                position: 'absolute', right: -50, top: -50, width: 300, height: 300,
                                borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
                                filter: 'blur(40px)'
                            }} />
                            <Box sx={{
                                position: 'absolute', right: 150, bottom: -100, width: 250, height: 250,
                                borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                                filter: 'blur(30px)'
                            }} />
                        </Box>
                    </motion.div>

                    <Container maxWidth="xl" sx={{ flexGrow: 1, mb: 6 }}>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Overview Section */}
                            <Box mb={2} display="flex" alignItems="center" gap={1}>
                                <Typography variant="h5" fontWeight="800" color="text.primary">
                                    Overview
                                </Typography>
                            </Box>

                            <Grid container spacing={3} mb={6}>
                                {overviewItems.map((item, index) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                                        <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                                            <Card sx={{
                                                bgcolor: 'background.paper',
                                                borderRadius: 3,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                                                height: '100%',
                                                overflow: 'visible',
                                                position: 'relative'
                                            }}>
                                                <Box sx={{
                                                    height: 4,
                                                    width: '100%',
                                                    bgcolor: item.iconColor,
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    borderTopLeftRadius: 12,
                                                    borderTopRightRadius: 12
                                                }} />
                                                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: 3 }}>
                                                    <Box sx={{
                                                        bgcolor: item.color,
                                                        p: 1.5,
                                                        borderRadius: 2,
                                                        color: item.iconColor,
                                                        mb: 2,
                                                    }}>
                                                        {item.icon}
                                                    </Box>
                                                    <Typography variant="h3" fontWeight="800" color="text.primary" sx={{ mb: 0.5 }}>
                                                        {item.count}
                                                    </Typography>
                                                    <Typography variant="subtitle2" fontWeight="700" color="text.secondary" sx={{ letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                                                        {item.title}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Quick Actions Section */}
                            <Box mb={2} display="flex" alignItems="center" gap={1}>
                                <Typography variant="h5" fontWeight="800" color="text.primary">
                                    Quick Actions
                                </Typography>
                            </Box>

                            <Grid container spacing={3}>
                                {menuItems.map((item, index) => (
                                    <Grid size={{ xs: 12, md: 6, lg: 3 }} key={index}>
                                        <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Card sx={{
                                                height: '100%',
                                                borderRadius: 4,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                                                cursor: 'pointer',
                                                background: `linear-gradient(to bottom right, #ffffff, ${item.color})`
                                            }} onClick={() => navigate(item.path)}>
                                                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 4 }}>
                                                    <Box display="flex" alignItems="center" mb={2}>
                                                        <Box sx={{
                                                            bgcolor: 'white',
                                                            p: 1.5,
                                                            borderRadius: 3,
                                                            color: item.iconColor,
                                                            mr: 2,
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                                        }}>
                                                            {item.icon}
                                                        </Box>
                                                        <Typography variant="h6" fontWeight="800">
                                                            {item.title}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4, flexGrow: 1, fontWeight: 500 }}>
                                                        {item.description}
                                                    </Typography>
                                                    <Button
                                                        endIcon={<ArrowForward />}
                                                        sx={{
                                                            justifyContent: 'space-between',
                                                            textTransform: 'none',
                                                            fontWeight: 700,
                                                            color: item.iconColor,
                                                            bgcolor: 'white',
                                                            px: 2,
                                                            py: 1,
                                                            borderRadius: 2,
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                            '&:hover': { bgcolor: 'white', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }
                                                        }}
                                                    >
                                                        {item.buttonText}
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>
                        </motion.div>
                    </Container>

                    <SiteFooter />
                </>
            )}
        </Box>
    );
};

export default AdminDashboard;
