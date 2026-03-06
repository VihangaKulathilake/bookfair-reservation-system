import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, Box, Chip, Container, useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/layout/UserNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import { getReservationsByUserId, cancelReservation, getStoredAuth } from '../../api/dashboardApi';
import ModernAlert from '../../components/common/ModernAlert';
import { Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';

const VendorReservations = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [user] = useState(getStoredAuth());
    const [alert, setAlert] = useState({ open: false, title: '', message: '', severity: 'warning' });
    const [cancelConfirm, setCancelConfirm] = useState({ open: false, id: null });

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    useEffect(() => {
        if (user?.userId) {
            fetchReservations();
        }
    }, [user]);

    const fetchReservations = async () => {
        try {
            const data = await getReservationsByUserId(user.userId);
            setReservations(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch reservations", error);
        }
    };

    const handleCancel = (id) => {
        setCancelConfirm({ open: true, id });
    };

    const handleConfirmCancel = async () => {
        const id = cancelConfirm.id;
        try {
            await cancelReservation(id);
            fetchReservations();
            setAlert({
                open: true,
                title: 'Success',
                message: 'Reservation cancelled successfully.',
                severity: 'success'
            });
        } catch (error) {
            setAlert({
                open: true,
                title: 'Cancellation Failed',
                message: error.response?.data?.message || 'Failed to cancel reservation.',
                severity: 'error'
            });
        } finally {
            setCancelConfirm({ open: false, id: null });
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
            <UserNavbar userName={user?.businessName || 'Vendor'} onLogout={handleLogout} />

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Container maxWidth="xl">
                    <Typography variant="h4" gutterBottom>My Reservations</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Stalls</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reservations.map((res) => (
                                    <TableRow key={res.reservationId}>
                                        <TableCell>{res.reservationId}</TableCell>
                                        <TableCell>{res.reservationDate}</TableCell>
                                        <TableCell>{res.stallCodes?.join(', ')}</TableCell>
                                        <TableCell>
                                            <Chip label={res.reservationStatus} color={res.reservationStatus === 'CONFIRMED' ? 'success' : 'warning'} />
                                        </TableCell>
                                        <TableCell>
                                            {res.reservationStatus === 'PENDING' && (
                                                <Button color="error" onClick={() => handleCancel(res.reservationId)}>
                                                    Cancel
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </Box>

            <ModernAlert
                open={alert.open}
                title={alert.title}
                message={alert.message}
                severity={alert.severity}
                onClose={() => setAlert({ ...alert, open: false })}
            />

            <Dialog
                open={cancelConfirm.open}
                onClose={() => setCancelConfirm({ open: false, id: null })}
                PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 800 }}>Confirm Cancellation</DialogTitle>
                <Divider sx={{ mx: 3 }} />
                <DialogContent>
                    <Typography variant="body1">
                        Are you sure you want to cancel this reservation? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setCancelConfirm({ open: false, id: null })} sx={{ fontWeight: 700, color: 'text.secondary' }}>No, Keep it</Button>
                    <Button onClick={handleConfirmCancel} variant="contained" color="error" sx={{ fontWeight: 700, borderRadius: '12px', px: 3 }}>
                        Yes, Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <SiteFooter />
        </Box>
    );
};

export default VendorReservations;
