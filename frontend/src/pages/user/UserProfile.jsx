import React, { useEffect, useState } from 'react';
import {
    Typography, Box, useTheme, Container, Grid, Paper, Avatar,
    Chip, Button, Divider, Skeleton, alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    Building2, Mail, Phone, MapPin, Globe, Award,
    Calendar, ShieldCheck, User as UserIcon, LogOut, Edit3
} from 'lucide-react';
import UserNavbar from '../../components/layout/UserNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import { getStoredAuth, getVendorById } from '../../api/dashboardApi';

const UserProfile = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const storedUser = getStoredAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (storedUser?.userId) {
                try {
                    const data = await getVendorById(storedUser.userId);
                    setUserData(data);
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                    // Fallback to stored user if API fails
                    setUserData(storedUser);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [storedUser?.userId]);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const InfoItem = ({ icon, label, value }) => (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2.5 }}>
            <Box
                sx={{
                    mr: 2,
                    p: 1.2,
                    borderRadius: '12px',
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.primary.main,
                    display: 'flex'
                }}
            >
                {icon}
            </Box>
            <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>
                    {label}
                </Typography>
                <Typography variant="body1" fontWeight={500} color="text.primary">
                    {value || 'Not provided'}
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8f9fc' }}>
            <UserNavbar userName={userData?.businessName || storedUser?.businessName || 'User'} onLogout={handleLogout} />

            <Box component="main" sx={{ flexGrow: 1, pb: 6 }}>
                {/* Header Banner */}
                <Box
                    sx={{
                        height: { xs: 200, md: 280 },
                        width: '100%',
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                        position: 'relative',
                        mb: { xs: 8, md: 10 }
                    }}
                >
                    <Container maxWidth="lg" sx={{ height: '100%', position: 'relative' }}>
                        {/* Profile Card Overlay */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: -60,
                                left: { xs: 16, md: 24 },
                                right: { xs: 16, md: 'auto' },
                                display: 'flex',
                                alignItems: 'flex-end',
                                gap: 3
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: { xs: 100, md: 140 },
                                    height: { xs: 100, md: 140 },
                                    border: '5px solid #fff',
                                    bgcolor: theme.palette.secondary.main,
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    fontWeight: 700,
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                                }}
                            >
                                {(userData?.businessName || 'U').charAt(0).toUpperCase()}
                            </Avatar>

                            <Box sx={{ mb: { xs: 2, md: 7 }, flex: 1, position: 'relative', top: { xs: 0, md: -10 } }}>
                                {loading ? (
                                    <Skeleton width={200} height={40} />
                                ) : (
                                    <Typography
                                        variant="h3"
                                        fontWeight={800}
                                        sx={{
                                            color: '#fff',
                                            textShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                            fontSize: { xs: '1.75rem', md: '2.5rem' },
                                            mb: 0.5
                                        }}
                                    >
                                        {userData?.businessName || 'BookFair Vendor'}
                                    </Typography>
                                )}

                                <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                    <Chip
                                        icon={<ShieldCheck size={14} color="#c6c6c6ff" />}
                                        label={userData?.role || 'VENDOR'}
                                        size="small"
                                        sx={{
                                            fontWeight: 700,
                                            bgcolor: 'rgba(255,255,255,0.2)',
                                            color: '#c6c6c6ff',
                                            backdropFilter: 'blur(4px)',
                                            border: '1px solid rgba(193, 193, 193, 0.3)'
                                        }}
                                    />
                                    <Chip
                                        icon={<Award size={14} />}
                                        label="Verified Member"
                                        size="small"
                                        variant="filled"
                                        sx={{
                                            fontWeight: 600,
                                            bgcolor: 'rgba(46, 204, 113, 0.2)', // Light green tint
                                            color: '#2ecc71',
                                            border: '1px solid rgba(46, 204, 113, 0.4)',
                                            backdropFilter: 'blur(4px)',
                                            '& .MuiChip-icon': {
                                                color: '#2ecc71'
                                            }
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Container>
                </Box>

                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={8}>
                            {/* Profile Details Card */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    borderRadius: 4,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h5" fontWeight={700} color="text.primary">
                                        Account Details
                                    </Typography>
                                    <Button
                                        startIcon={<Edit3 size={16} />}
                                        variant="outlined"
                                        size="small"
                                        sx={{ borderRadius: '8px' }}
                                        onClick={() => navigate('/user/edit-profile')}
                                    >
                                        Edit Profile
                                    </Button>
                                </Box>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="primary" fontWeight={700} sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem' }}>
                                            Company Information
                                        </Typography>
                                        {loading ? (
                                            <Box sx={{ pt: 1 }}><Skeleton width="80%" /><Skeleton width="60%" /></Box>
                                        ) : (
                                            <>
                                                <InfoItem
                                                    icon={<Building2 size={20} />}
                                                    label="Business Name"
                                                    value={userData?.businessName}
                                                />
                                                <InfoItem
                                                    icon={<Award size={20} />}
                                                    label="Business Reg. Number"
                                                    value={userData?.id}
                                                />
                                                <InfoItem
                                                    icon={<MapPin size={20} />}
                                                    label="Address"
                                                    value={userData?.address}
                                                />
                                            </>
                                        )}
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="primary" fontWeight={700} sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem' }}>
                                            Contact Information
                                        </Typography>
                                        {loading ? (
                                            <Box sx={{ pt: 1 }}><Skeleton width="80%" /><Skeleton width="60%" /></Box>
                                        ) : (
                                            <>
                                                <InfoItem
                                                    icon={<UserIcon size={20} />}
                                                    label="Contact Person"
                                                    value={userData?.contactPerson}
                                                />
                                                <InfoItem
                                                    icon={<Mail size={20} />}
                                                    label="Email Address"
                                                    value={userData?.email}
                                                />
                                                <InfoItem
                                                    icon={<Phone size={20} />}
                                                    label="Phone Number"
                                                    value={userData?.contactNumber}
                                                />
                                            </>
                                        )}
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            {/* Summary / Stats Card */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 4,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    height: '100%',
                                    bgcolor: '#fff'
                                }}
                            >
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    Quick Stats
                                </Typography>
                                <Divider sx={{ mb: 3 }} />

                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Calendar size={18} color={theme.palette.text.secondary} style={{ marginRight: 8 }} />
                                        <Typography variant="body2" color="text.secondary">Member Since</Typography>
                                    </Box>
                                    <Typography variant="h6" fontWeight={600}>
                                        February 2026
                                    </Typography>
                                </Box>

                                <Box sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2, mb: 3 }}>
                                    <Typography variant="body2" color="info.main" fontWeight={600} gutterBottom>
                                        Reservation Status
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        You have active reservations for the upcoming BookFair. Check your dashboard for details.
                                    </Typography>
                                </Box>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate('/user/my-reservations')}
                                    sx={{ py: 1.5, borderRadius: '10px', mb: 2 }}
                                >
                                    My Reservations
                                </Button>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    startIcon={<LogOut size={18} />}
                                    onClick={handleLogout}
                                    sx={{ py: 1.5, borderRadius: '10px' }}
                                >
                                    Log Out
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            <SiteFooter />
        </Box>
    );
};

export default UserProfile;
