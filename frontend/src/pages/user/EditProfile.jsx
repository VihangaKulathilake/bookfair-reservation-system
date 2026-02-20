import React, { useState, useEffect } from 'react';
import {
    Box, Container, Paper, Typography, TextField, Button, Grid,
    Avatar, IconButton, alpha, useTheme, Snackbar, Alert, CircularProgress,
    Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    User, Mail, Phone, MapPin, Building2, Save, X, ArrowLeft, Camera
} from 'lucide-react';
import UserNavbar from '../../components/layout/UserNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { getStoredAuth, getUserById, updateUser } from '../../api/dashboardApi';
import { logoutUser } from '../../api/authApi';

const EditProfile = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const storedUser = getStoredAuth();

    const [formData, setFormData] = useState({
        businessName: '',
        contactPerson: '',
        email: '',
        contactNumber: '',
        address: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const fetchUserData = async () => {
            if (storedUser?.userId) {
                try {
                    const data = await getUserById(storedUser.userId);
                    setFormData({
                        businessName: data.businessName || '',
                        contactPerson: data.contactPerson || '',
                        email: data.email || '',
                        contactNumber: data.contactNumber || '',
                        address: data.address || ''
                    });
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                    setSnackbar({ open: true, message: 'Failed to load user profile.', severity: 'error' });
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchUserData();
    }, [storedUser?.userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateUser(storedUser.userId, formData);
            setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
            setTimeout(() => navigate('/user/profile'), 1500);
        } catch (error) {
            console.error("Update failed:", error);
            setSnackbar({ open: true, message: 'Update failed. Please try again.', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8f9fc' }}>
            <UserNavbar userName={formData.businessName || 'User'} onLogout={handleLogout} />

            <Container maxWidth="md" sx={{ mt: 4, mb: 6, flexGrow: 1 }}>
                <Button
                    startIcon={<ArrowLeft size={18} />}
                    onClick={() => navigate('/user/profile')}
                    sx={{ mb: 3, textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
                >
                    Back to Profile
                </Button>

                <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', border: '1px solid', borderColor: alpha(theme.palette.divider, 0.1) }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 3 }}>
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                sx={{
                                    width: 100,
                                    height: 100,
                                    bgcolor: theme.palette.primary.main,
                                    fontSize: '2.5rem',
                                    fontWeight: 700,
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                }}
                            >
                                {formData.businessName?.charAt(0).toUpperCase()}
                            </Avatar>
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    bgcolor: 'white',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    '&:hover': { bgcolor: '#f5f5f5' }
                                }}
                                size="small"
                            >
                                <Camera size={16} />
                            </IconButton>
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight={800} color="text.primary">Edit Profile</Typography>
                            <Typography variant="body2" color="text.secondary">Update your business information and contact details</Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" fontWeight={700} mb={1} color="text.primary">Business Name</Typography>
                                <TextField
                                    fullWidth
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter business name"
                                    InputProps={{
                                        startAdornment: <Building2 size={18} style={{ marginRight: 12, color: theme.palette.text.secondary }} />
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" fontWeight={700} mb={1} color="text.primary">Contact Person</Typography>
                                <TextField
                                    fullWidth
                                    name="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter contact person name"
                                    InputProps={{
                                        startAdornment: <User size={18} style={{ marginRight: 12, color: theme.palette.text.secondary }} />
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" fontWeight={700} mb={1} color="text.primary">Email Address</Typography>
                                <TextField
                                    fullWidth
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter email address"
                                    InputProps={{
                                        startAdornment: <Mail size={18} style={{ marginRight: 12, color: theme.palette.text.secondary }} />
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" fontWeight={700} mb={1} color="text.primary">Phone Number</Typography>
                                <TextField
                                    fullWidth
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter phone number"
                                    InputProps={{
                                        startAdornment: <Phone size={18} style={{ marginRight: 12, color: theme.palette.text.secondary }} />
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" fontWeight={700} mb={1} color="text.primary">Business Address</Typography>
                                <TextField
                                    fullWidth
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    multiline
                                    rows={3}
                                    placeholder="Enter full business address"
                                    InputProps={{
                                        startAdornment: <MapPin size={18} style={{ marginRight: 12, color: theme.palette.text.secondary, alignSelf: 'flex-start', marginTop: '12px' }} />
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 5, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/user/profile')}
                                startIcon={<X size={18} />}
                                sx={{ borderRadius: '12px', px: 4, py: 1.2, textTransform: 'none', fontWeight: 600 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={saving}
                                startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save size={18} />}
                                sx={{
                                    borderRadius: '12px',
                                    px: 4,
                                    py: 1.2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`
                                }}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>

            <SiteFooter />
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default EditProfile;
