import React, { useState, useEffect } from 'react';
import {
    Box, Container, Paper, Typography, TextField, Button, Grid, Avatar, IconButton,
    Snackbar, Alert, CircularProgress, alpha, useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Building2, Phone, MapPin, Mail } from 'lucide-react';
import { getStoredAuth } from '../../api/dashboardApi';
import { updateUserProfile, getUserProfile } from '../../api/userApi';
import UserNavbar from '../../components/layout/UserNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';

const EditProfile = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userData, setUserData] = useState({
        businessName: '',
        contactPerson: '',
        address: '',
        contactNumber: '',
        email: ''
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const fetchUserData = async () => {
            const auth = getStoredAuth();
            if (!auth || !auth.userId) {
                navigate('/login');
                return;
            }

            try {
                const result = await getUserProfile(auth.userId);
                if (result.success) {
                    const data = result.data;
                    setUserData({
                        businessName: data.businessName || '',
                        contactPerson: data.contactPerson || '',
                        address: data.address || '',
                        contactNumber: data.contactNumber || '',
                        email: data.email || ''
                    });
                } else {
                    setSnackbar({ open: true, message: result.message, severity: 'error' });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setSnackbar({ open: true, message: 'Failed to load profile data', severity: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const auth = getStoredAuth();
        const result = await updateUserProfile(auth.userId, userData);

        if (result.success) {
            setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
            setTimeout(() => navigate('/user/profile'), 1500);
        } else {
            setSnackbar({ open: true, message: result.message, severity: 'error' });
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F8FAFC' }}>
            <UserNavbar userName={userData?.businessName || 'Vendor'} onLogout={handleLogout} />

            <Container maxWidth="md" sx={{ py: 6, flexGrow: 1 }}>
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => navigate('/user/profile')} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                        <ArrowLeft size={20} />
                    </IconButton>
                    <Typography variant="h4" fontWeight={700}>Edit Profile</Typography>
                </Box>

                <Paper sx={{ p: 5, borderRadius: 6, boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid', borderColor: 'divider' }}>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <Avatar
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        fontSize: '2.5rem',
                                        bgcolor: theme.palette.primary.main,
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {userData.businessName.charAt(0).toUpperCase()}
                                </Avatar>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Business Name"
                                    name="businessName"
                                    value={userData.businessName}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        startAdornment: <Building2 size={20} style={{ marginRight: 10, color: theme.palette.text.secondary }} />
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Contact Person"
                                    name="contactPerson"
                                    value={userData.contactPerson}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        startAdornment: <User size={20} style={{ marginRight: 10, color: theme.palette.text.secondary }} />
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    value={userData.email}
                                    disabled
                                    helperText="Email cannot be changed"
                                    InputProps={{
                                        startAdornment: <Mail size={20} style={{ marginRight: 10, color: theme.palette.text.secondary }} />
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Contact Number"
                                    name="contactNumber"
                                    value={userData.contactNumber}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        startAdornment: <Phone size={20} style={{ marginRight: 10, color: theme.palette.text.secondary }} />
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    name="address"
                                    value={userData.address}
                                    onChange={handleChange}
                                    multiline
                                    rows={3}
                                    required
                                    InputProps={{
                                        startAdornment: <MapPin size={20} style={{ marginRight: 10, marginTop: -40, color: theme.palette.text.secondary }} />
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/user/profile')}
                                    sx={{ borderRadius: '12px', px: 4, textTransform: 'none', fontWeight: 600 }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={saving}
                                    startIcon={saving ? <CircularProgress size={20} /> : <Save size={20} />}
                                    sx={{
                                        borderRadius: '12px',
                                        px: 6,
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
            <SiteFooter />
        </Box>
    );
};

export default EditProfile;
