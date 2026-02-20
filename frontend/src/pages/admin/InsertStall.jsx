import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
    Divider,
    Alert,
    InputAdornment,
    useTheme,
    alpha
} from '@mui/material';
import {
    Store,
    DollarSign,
    CheckCircle,
    Tag,
    SquareStack
} from 'lucide-react';
import AdminNavbar from '../../components/layout/AdminNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { createStall } from '../../api/stallsApi';

const InsertStall = () => {
    const theme = useTheme();
    const [formData, setFormData] = useState({
        stallCode: '',
        stallSize: '',
        price: '',
    });

    const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(false);

    const stallSizes = [
        { value: 'SMALL', label: 'Small' },
        { value: 'MEDIUM', label: 'Medium' },
        { value: 'LARGE', label: 'Large' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ show: false, message: '', severity: 'success' });

        try {
            await createStall(formData);
            setAlert({
                show: true,
                message: 'Stall added successfully!',
                severity: 'success'
            });
            setFormData({ stallCode: '', stallSize: '', price: '' });
        } catch (error) {
            setAlert({
                show: true,
                message: error.message,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', bgcolor: theme.palette.background.default }}>
            <AdminNavbar userName="Administrator" />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                            background: `linear-gradient(to bottom right, #fff, ${alpha(theme.palette.primary.main, 0.03)})`
                        }}
                    >
                        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main
                                }}
                            >
                                <Store size={28} />
                            </Box>
                            <Box>
                                <Typography variant="h5" fontWeight="bold" color="text.primary">
                                    Add New Stall
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Enter the details for the new exhibition stall.
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 4 }} />

                        {alert.show && (
                            <Alert severity={alert.severity} sx={{ mb: 3 }} onClose={() => setAlert({ ...alert, show: false })}>
                                {alert.message}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                {/* Stall Code */}
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Stall Code</Typography>
                                    <TextField
                                        fullWidth
                                        name="stallCode"
                                        placeholder="e.g. A-101"
                                        value={formData.stallCode}
                                        onChange={handleChange}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Tag size={18} color={theme.palette.text.secondary} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                {/* Size */}
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Size</Typography>
                                    <TextField
                                        select
                                        fullWidth
                                        name="stallSize"
                                        value={formData.stallSize}
                                        onChange={handleChange}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SquareStack size={18} color={theme.palette.text.secondary} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    >
                                        {stallSizes.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                {/* Price */}
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Price</Typography>
                                    <TextField
                                        fullWidth
                                        name="price"
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <DollarSign size={18} color={theme.palette.text.secondary} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sx={{ mt: 2 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        disabled={loading}
                                        startIcon={<CheckCircle size={20} />}
                                        sx={{
                                            py: 1.5,
                                            fontWeight: 600,
                                            borderRadius: 2
                                        }}
                                    >
                                        {loading ? 'Creating...' : 'Create Stall'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Box>
            </Box>
            <SiteFooter />
        </Box>
    );
};

export default InsertStall;
