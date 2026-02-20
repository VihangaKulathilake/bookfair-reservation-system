import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, Box, Chip, Container, useTheme, alpha, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/layout/AdminNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import { getAllReservations, updateReservationStatus, deleteReservation, getStoredAuth } from '../../api/dashboardApi';

const AdminReservations = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = getStoredAuth();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const data = await getAllReservations();
            setReservations(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch reservations", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await updateReservationStatus(id, status);
            fetchReservations();
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this reservation?")) {
            try {
                await deleteReservation(id);
                fetchReservations();
            } catch (error) {
                alert("Failed to delete reservation");
            }
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8f9fc' }}>
            <AdminNavbar userName={user?.contactPerson || user?.businessName || 'Admin'} onLogout={handleLogout} />

            <Box component="main" sx={{ flexGrow: 1, py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
                <Container maxWidth="xl">
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h4" fontWeight={800} color="text.primary">Manage Reservations</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>View and manage all book stall reservations.</Typography>
                        </Box>
                        {loading && <CircularProgress size={24} color="secondary" />}
                    </Box>

                    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '24px', border: '1px solid', borderColor: alpha(theme.palette.divider, 0.1), overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <TableHead sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.02) }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', py: 2.5 }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', py: 2.5 }}>Business / Vendor</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', py: 2.5 }}>Date & Time</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', py: 2.5 }}>Stalls</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', py: 2.5 }}>Total Amount</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', py: 2.5 }}>Current Status</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', py: 2.5, pr: 4 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reservations.map((res) => (
                                    <TableRow
                                        key={res.reservationId}
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            '&:hover': { bgcolor: alpha(theme.palette.secondary.main, 0.01) },
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 700, color: 'secondary.main', fontSize: '0.9rem' }}>#{res.reservationId}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Typography variant="body2" fontWeight={700} color="text.primary">{res.businessName || 'Guest Vendor'}</Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8 }}>{res.email}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Typography variant="body2" fontWeight={500}>{new Date(res.reservationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</Typography>
                                                <Typography variant="caption" color="text.secondary">{new Date(res.reservationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {res.stallCodes && res.stallCodes.length > 0 ? (
                                                <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                                                    {res.stallCodes.map(code => (
                                                        <Chip
                                                            key={code}
                                                            label={code}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{
                                                                borderRadius: '8px',
                                                                fontWeight: 700,
                                                                fontSize: '0.7rem',
                                                                borderColor: alpha(theme.palette.secondary.main, 0.1),
                                                                bgcolor: alpha(theme.palette.secondary.main, 0.02)
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            ) : (
                                                <Typography variant="caption" color="text.disabled">No stalls assigned</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 800, color: 'text.primary' }}>
                                            Rs. {res.totalAmount?.toLocaleString() || '0'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={res.reservationStatus}
                                                size="small"
                                                sx={{
                                                    borderRadius: '10px',
                                                    fontWeight: 800,
                                                    fontSize: '0.65rem',
                                                    letterSpacing: '0.5px',
                                                    minWidth: 90,
                                                    textTransform: 'uppercase',
                                                    ...(res.reservationStatus === 'CONFIRMED' ? {
                                                        bgcolor: alpha(theme.palette.success.main, 0.1),
                                                        color: theme.palette.success.dark,
                                                        border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                                                    } : res.reservationStatus === 'CANCELLED' ? {
                                                        bgcolor: alpha(theme.palette.error.main, 0.1),
                                                        color: theme.palette.error.dark,
                                                        border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
                                                    } : {
                                                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                                                        color: theme.palette.warning.dark,
                                                        border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
                                                    })
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right" sx={{ pr: 4 }}>
                                            {res.reservationStatus === 'PENDING' ? (
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={() => handleStatusChange(res.reservationId, 'CONFIRMED')}
                                                        sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 2, py: 0.8, boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.2)}` }}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => handleStatusChange(res.reservationId, 'CANCELLED')}
                                                        sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 2, py: 0.8 }}
                                                    >
                                                        Reject
                                                    </Button>
                                                </Box>
                                            ) : (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => handleDelete(res.reservationId)}
                                                        sx={{
                                                            borderRadius: '10px',
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            fontSize: '0.75rem',
                                                            opacity: 0.6,
                                                            '&:hover': { opacity: 1 }
                                                        }}
                                                    >
                                                        Delete Record
                                                    </Button>
                                                </Box>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!loading && reservations.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                                            <Box sx={{ opacity: 0.5 }}>
                                                <Typography variant="h6" fontWeight={700}>No Reservations Found</Typography>
                                                <Typography variant="body2">Current filters returned no results.</Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) || loading && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                                            <CircularProgress size={40} color="secondary" />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </Box>
            <SiteFooter />
        </Box>
    );
};

export default AdminReservations;
