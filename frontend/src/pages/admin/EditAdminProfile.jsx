import React, { useState, useEffect } from 'react';
import {
    Box, Container, Paper, Typography, TextField, Button, Grid,
    Avatar, IconButton, alpha, useTheme, Snackbar, Alert, CircularProgress,
    Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    Mail, Phone, Save, X, ArrowLeft, Shield
} from 'lucide-react';
import AdminNavbar from '../../components/layout/AdminNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { getStoredAuth, getUserById, updateUser } from '../../api/dashboardApi';
import { logoutUser } from '../../api/authApi';
import ModernAlert from '../../components/common/ModernAlert';
import { User as UserIcon } from 'lucide-react';

const EditAdminProfile = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const storedUser = getStoredAuth();

    const [formData, setFormData] = useState({
        contactPerson: '',
        email: '',
        contactNumber: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, title: '', message: '', severity: 'success' });

    useEffect(() => {
        const fetchUserData = async () => {
            if (storedUser?.userId) {
                try {
                    const data = await getUserById(storedUser.userId);
                    setFormData({
                        contactPerson: data.contactPerson || '',
                        email: data.email || '',
                        contactNumber: data.contactNumber || ''
                    });
                } catch (error) {
                    console.error("Failed to fetch admin data:", error);
                    setSnackbar({ open: true, title: 'Profile Error', message: "Can't load profile details.", severity: 'error' });
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
            setSnackbar({ open: true, title: 'Success!', message: 'Profile updated successfully!', severity: 'success' });
            setTimeout(() => navigate('/admin/profile'), 1500);
        } catch (error) {
            console.error("Update failed:", error);
            setSnackbar({ open: true, title: "Can't Update Profile", message: 'Saving changes failed. Please try again.', severity: 'error' });
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
                <CircularProgress color="secondary" />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8f9fc' }}>
            <AdminNavbar userName={formData.contactPerson || formData.email || 'Admin'} onLogout={handleLogout} />

            <Container maxWidth="md" sx={{ mt: 4, mb: 6, flexGrow: 1 }}>
                <Button
                    startIcon={<ArrowLeft size={18} />}
                    onClick={() => navigate('/admin/profile')}
                    color="secondary"
                    sx={{ mb: 3, textTransform: 'none', fontWeight: 600 }}
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
                                    bgcolor: theme.palette.secondary.main,
                                    fontSize: '2.5rem',
                                    fontWeight: 700,
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                }}
                            >
                                {formData.email?.charAt(0).toUpperCase()}
                            </Avatar>
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight={800} color="text.primary">Edit Admin Profile</Typography>
                            <Typography variant="body2" color="text.secondary">Manage your administrative account settings</Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <ModernAlert
                        open={snackbar.open}
                        title={snackbar.title}
                        message={snackbar.message}
                        severity={snackbar.severity}
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                    />

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" fontWeight={700} mb={1} color="text.primary">Contact Person Name</Typography>
                                <TextField
                                    fullWidth
                                    name="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter contact person name"
                                    InputProps={{
                                        startAdornment: <UserIcon size={18} style={{ marginRight: 12, color: theme.palette.text.secondary }} />
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
                        </Grid>

                        <Box sx={{ mt: 5, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => navigate('/admin/profile')}
                                startIcon={<X size={18} />}
                                sx={{ borderRadius: '12px', px: 4, py: 1.2, textTransform: 'none', fontWeight: 600 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="secondary"
                                disabled={saving}
                                startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save size={18} />}
                                sx={{
                                    borderRadius: '12px',
                                    px: 4,
                                    py: 1.2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    boxShadow: `0 8px 16px ${alpha(theme.palette.secondary.main, 0.25)}`
                                }}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>

            <SiteFooter />
        </Box>
    );
};

export default EditAdminProfile;
