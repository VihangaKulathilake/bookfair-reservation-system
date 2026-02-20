import React, { useEffect, useState } from 'react';
import {
    Typography, Box, useTheme, Container, Card, CardContent, Chip, Stack, Button, CircularProgress, Alert,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useMediaQuery, IconButton, Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/layout/UserNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import { getStoredAuth, getReservationsByUserId, cancelReservation } from '../../api/dashboardApi';
import { CalendarMonth, Storefront, MonetizationOn, Cancel, DeleteForever } from '@mui/icons-material';

const MyReservations = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const user = getStoredAuth();

    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedReservationId, setSelectedReservationId] = useState(null);

    const fetchReservations = async () => {
        if (!user || (!user.userId && !user.id)) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const userId = user.userId || user.id;
            const data = await getReservationsByUserId(userId);
            // Sort by date descending
            const sorted = Array.isArray(data) ? data.sort((a, b) => new Date(b.reservationDate) - new Date(a.reservationDate)) : [];
            setReservations(sorted);
        } catch (err) {
            console.error("Failed to fetch reservations:", err);
            setError('Failed to load your reservations. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const handleCancelClick = (id) => {
        setSelectedReservationId(id);
        setCancelDialogOpen(true);
    };

    const handleConfirmCancel = async () => {
        if (!selectedReservationId) return;

        try {
            await cancelReservation(selectedReservationId);
            setCancelDialogOpen(false);
            setSelectedReservationId(null);
            fetchReservations(); // Refresh list
        } catch (err) {
            console.error("Failed to cancel reservation:", err);
            alert('Failed to cancel reservation.');
        }
    };

    const getStatusChip = (status) => {
        let color = 'default';
        if (status === 'CONFIRMED') color = 'success';
        if (status === 'PENDING') color = 'warning';
        if (status === 'CANCELLED') color = 'error';

        return <Chip label={status} color={color} size="small" sx={{ fontWeight: 'bold' }} />;
    };

    // --- Desktop View: Modern Table ---
    const DesktopView = () => (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Table sx={{ minWidth: 650 }} aria-label="reservations table">
                <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Date & Time</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Stalls</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Total Amount</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reservations.map((row) => (
                        <TableRow
                            key={row.reservationId}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.2s' }}
                        >
                            <TableCell component="th" scope="row" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.95rem' }}>
                                #{row.reservationId}
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" fontWeight={600} color="text.primary">
                                    {new Date(row.reservationDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                    {new Date(row.reservationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Stack direction="row" gap={0.5} flexWrap="wrap">
                                    {row.stallCodes && row.stallCodes.map(code => (
                                        <Chip key={code} label={code} size="small" variant="outlined" sx={{ borderRadius: 1.5, fontWeight: 600, bgcolor: 'background.paper' }} />
                                    ))}
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" fontWeight={700} color="text.primary">
                                    Rs. {row.totalAmount?.toLocaleString()}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                {getStatusChip(row.reservationStatus)}
                            </TableCell>
                            <TableCell align="right">
                                {row.reservationStatus !== 'CANCELLED' && (
                                    <Tooltip title="Cancel Reservation">
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => handleCancelClick(row.reservationId)}
                                            startIcon={<Cancel />}
                                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2 }}
                                        >
                                            Cancel
                                        </Button>
                                    </Tooltip>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    // --- Mobile View: Enhanced Cards ---
    const MobileView = () => (
        <Stack spacing={2}>
            {reservations.map((res) => (
                <Card key={res.reservationId} sx={{ borderRadius: 3, boxShadow: theme.shadows[2], border: `1px solid ${theme.palette.divider}` }}>
                    <CardContent sx={{ p: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                            <Typography variant="h6" fontWeight={700} color="primary.main">
                                #{res.reservationId}
                            </Typography>
                            {getStatusChip(res.reservationStatus)}
                        </Stack>

                        <Stack spacing={1.5}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <CalendarMonth fontSize="small" color="action" />
                                <Box>
                                    <Typography variant="body2" fontWeight={600}>
                                        {new Date(res.reservationDate).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(res.reservationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Storefront fontSize="small" color="action" />
                                <Stack direction="row" gap={0.5} flexWrap="wrap">
                                    {res.stallCodes && res.stallCodes.map(code => (
                                        <Chip key={code} label={code} size="small" variant="outlined" sx={{ borderRadius: 1 }} />
                                    ))}
                                </Stack>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <MonetizationOn fontSize="small" color="action" />
                                <Typography variant="body2" fontWeight={700}>
                                    Rs. {res.totalAmount?.toLocaleString()}
                                </Typography>
                            </Box>
                        </Stack>

                        {res.reservationStatus !== 'CANCELLED' && (
                            <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteForever />}
                                    onClick={() => handleCancelClick(res.reservationId)}
                                    size="small"
                                >
                                    Cancel Reservation
                                </Button>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            ))}
        </Stack>
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
            <UserNavbar userName={user?.businessName || 'User'} onLogout={handleLogout} />

            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
                <Container maxWidth="lg">
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" mb={4} gap={2}>
                        <Box>
                            <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ letterSpacing: '-0.5px' }}>
                                My Reservations
                            </Typography>
                            <Typography variant="body1" color="text.secondary" mt={0.5}>
                                Manage your stall bookings and history
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Storefront />}
                            onClick={() => navigate('/user/stall-reservation')}
                            sx={{ borderRadius: 2, px: 3, py: 1, fontWeight: 700, textTransform: 'none', boxShadow: theme.shadows[4] }}
                        >
                            New Reservation
                        </Button>
                    </Stack>

                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress size={40} thickness={4} />
                        </Box>
                    ) : reservations.length === 0 ? (
                        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 4, bgcolor: 'background.paper', border: `1px dashed ${theme.palette.divider}` }}>
                            <Storefront sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" gutterBottom fontWeight={600}>
                                No reservations found
                            </Typography>
                            <Typography color="text.secondary" mb={4} maxWidth={400} mx="auto">
                                You haven't made any stall reservations yet. Start by exploring our available stalls!
                            </Typography>
                            <Button variant="outlined" onClick={() => navigate('/user/stall-reservation')}>
                                Book a Stall Now
                            </Button>
                        </Paper>
                    ) : (
                        // Render based on screen size
                        isMobile ? <MobileView /> : <DesktopView />
                    )}
                </Container>
            </Box>

            <SiteFooter />

            <Dialog
                open={cancelDialogOpen}
                onClose={() => setCancelDialogOpen(false)}
                PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>Cancel Reservation?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to cancel this reservation? This action cannot be undone and your stalls will be released immediately.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setCancelDialogOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>Keep it</Button>
                    <Button onClick={handleConfirmCancel} variant="contained" color="error" disableElevation sx={{ fontWeight: 600, borderRadius: 2 }}>
                        Yes, Cancel It
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MyReservations;
