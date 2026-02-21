import React, { useEffect, useState } from 'react';
import {
    Typography, Box, useTheme, Container, Grid, Paper, Avatar,
    Chip, Button, Divider, Skeleton, alpha, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    Mail, Phone, ShieldCheck, User as UserIcon, LogOut, Edit3,
    Calendar, Award, Building2
} from 'lucide-react';
import AdminNavbar from '../../components/layout/AdminNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import { getStoredAuth, getUserById, getUserByEmail } from '../../api/dashboardApi';

const AdminProfile = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const storedUser = getStoredAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = storedUser?.userId;
            const email = storedUser?.email;

            if (userId || email) {
                try {
                    let data;
                    if (userId) {
                        data = await getUserById(userId);
                    } else {
                        data = await getUserByEmail(email);
                    }
                    setUserData(data);
                } catch (error) {
                    console.error("Failed to fetch admin data:", error);
                    setUserData(storedUser);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [storedUser?.userId, storedUser?.email]);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const InfoItem = ({ icon, label, value }) => (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2.5 }}>
            <Box sx={{ mr: 2, p: 1.2, borderRadius: '12px', bgcolor: alpha(theme.palette.secondary.main, 0.08), color: theme.palette.secondary.main, display: 'flex' }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>{label}</Typography>
                <Typography variant="body1" fontWeight={500} color="text.primary">{value || 'Not provided'}</Typography>
            </Box>
        </Box>
    );

    if (loading && !userData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress color="secondary" />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8f9fc' }}>
            <AdminNavbar userName={userData?.contactPerson || userData?.email || 'Admin'} onLogout={handleLogout} />

            <Box component="main" sx={{ flexGrow: 1, pb: 6 }}>
                <Box sx={{ height: { xs: 150, md: 200 }, width: '100%', background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`, position: 'relative', mb: { xs: 8, md: 10 } }}>
                    <Container maxWidth="lg" sx={{ height: '100%', position: 'relative' }}>
                        <Box sx={{ position: 'absolute', bottom: -50, left: { xs: 16, md: 24 }, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
                            <Avatar sx={{ width: { xs: 100, md: 140 }, height: { xs: 100, md: 140 }, border: `6px solid #fff`, bgcolor: 'secondary.main', fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 800, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                                {(userData?.email || 'A').charAt(0).toUpperCase()}
                            </Avatar>
                            <Box sx={{ mb: { xs: 1, md: 2 }, flex: 1 }}>
                                <Typography variant="h3" fontWeight={800} sx={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.2)', fontSize: { xs: '1.5rem', md: '2.5rem' } }}>
                                    {userData?.contactPerson || 'Administrator'}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                    <Chip icon={<ShieldCheck size={14} />} label="SYSTEM ADMIN" size="small" color="secondary" sx={{ fontWeight: 700 }} />
                                </Box>
                            </Box>
                        </Box>
                    </Container>
                </Box>

                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={8}>
                            <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: '24px', border: '1px solid', borderColor: alpha(theme.palette.divider, 0.1) }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                    <Typography variant="h5" fontWeight={700} color="text.primary">Account Details</Typography>
                                    <Button variant="outlined" color="secondary" startIcon={<Edit3 size={18} />} onClick={() => navigate('/admin/edit-profile')} sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600 }}>Edit Profile</Button>
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <InfoItem icon={<UserIcon size={20} />} label="Contact Person" value={userData?.contactPerson} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InfoItem icon={<Mail size={20} />} label="Email Address" value={userData?.email} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InfoItem icon={<Phone size={20} />} label="Phone Number" value={userData?.contactNumber} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InfoItem icon={<Award size={20} />} label="Admin ID" value={userData?.id} />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', position: 'sticky', top: 100, background: alpha(theme.palette.secondary.main, 0.02), border: `1px dashed ${alpha(theme.palette.secondary.main, 0.2)}` }}>
                                <Typography variant="h6" fontWeight={700} mb={3}>System Overview</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: '16px', border: '1px solid', borderColor: alpha(theme.palette.divider, 0.1) }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">Permissions</Typography>
                                        <Typography variant="body2" fontWeight={700} color="success.main" sx={{ mt: 0.5 }}>Full Administrative Access</Typography>
                                    </Box>
                                    <Button fullWidth variant="contained" color="secondary" startIcon={<LogOut size={18} />} onClick={handleLogout} sx={{ mt: 2, borderRadius: '12px', py: 1.5, textTransform: 'none', fontWeight: 700, boxShadow: `0 8px 16px ${alpha(theme.palette.secondary.main, 0.2)}` }}>Logout Account</Button>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            <SiteFooter />
        </Box>
    );
};

export default AdminProfile;
