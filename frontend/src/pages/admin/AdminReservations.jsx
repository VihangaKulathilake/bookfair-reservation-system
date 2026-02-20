import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, Box, Chip, Container, useTheme, alpha, CircularProgress,
    IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    MenuItem, Stack, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/layout/AdminNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import { getAllReservations, updateReservationStatus, deleteReservation, updateReservation, getStoredAuth } from '../../api/dashboardApi';
import { Edit as EditIcon, Delete as DeleteIcon, CheckCircle, Cancel } from '@mui/icons-material';
import ModernAlert from '../../components/common/ModernAlert';

const AdminReservations = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [editData, setEditData] = useState({ totalAmount: '', reservationStatus: '' });
    const [alert, setAlert] = useState({ open: false, title: '', message: '', severity: 'warning' });
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

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateReservationStatus(id, status);
            fetchReservations();
            setAlert({ open: false });
        } catch (error) {
            setAlert({
                open: true,
                title: 'Operation Failed',
                message: error.response?.data?.message || "Could not update the reservation status. Please try again.",
                severity: 'error'
            });
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteReservation(id);
            fetchReservations();
            setAlert({ open: false });
        } catch (error) {
            setAlert({
                open: true,
                title: "Can't Delete Reservation",
                message: error.response?.data?.message || "Can't delete active reservations.",
                severity: 'warning'
            });
        }
    };

    const handleEditClick = (res) => {
        setSelectedReservation(res);
        setEditData({
            totalAmount: res.totalAmount || 0,
            reservationStatus: res.reservationStatus
        });
        setEditDialogOpen(true);
    };

    const handleEditSave = async () => {
        try {
            await updateReservation(selectedReservation.reservationId, {
                totalAmount: parseFloat(editData.totalAmount),
                reservationStatus: editData.reservationStatus
            });
            setEditDialogOpen(false);
            fetchReservations();
            setAlert({ open: false });
        } catch (error) {
            setAlert({
                open: true,
                title: 'Update Failed',
                message: error.response?.data?.message || "There was an error saving the changes to this reservation.",
                severity: 'error'
            });
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8f9fc' }}>
            <AdminNavbar userName={user?.contactPerson || user?.businessName || 'Admin'} onLogout={handleLogout} />

            <Box component="main" sx={{ flexGrow: 1, py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
                <Container maxWidth="xl">
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ letterSpacing: '-0.5px' }}>Manage Reservations</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>View and manage all book stall reservations.</Typography>
                        </Box>
                        {loading && <CircularProgress size={24} color="secondary" />}
                    </Box>

                    <ModernAlert
                        open={alert.open}
                        title={alert.title}
                        message={alert.message}
                        severity={alert.severity}
                        onClose={() => setAlert({ ...alert, open: false })}
                    />

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
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                {res.reservationStatus === 'PENDING' && (
                                                    <>
                                                        <Tooltip title="Approve">
                                                            <IconButton
                                                                size="small"
                                                                color="success"
                                                                onClick={() => handleStatusUpdate(res.reservationId, 'CONFIRMED')}
                                                                sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), '&:hover': { bgcolor: theme.palette.success.main, color: 'white' } }}
                                                            >
                                                                <CheckCircle fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Reject">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleStatusUpdate(res.reservationId, 'CANCELLED')}
                                                                sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), '&:hover': { bgcolor: theme.palette.error.main, color: 'white' } }}
                                                            >
                                                                <Cancel fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </>
                                                )}
                                                <Tooltip title="Edit Reservation">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleEditClick(res)}
                                                        sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), '&:hover': { bgcolor: theme.palette.primary.main, color: 'white' } }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Permanently">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDelete(res.reservationId)}
                                                        sx={{ bgcolor: alpha(theme.palette.error.main, 0.05), '&:hover': { bgcolor: theme.palette.error.main, color: 'white' } }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
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

                    {/* Edit Dialog */}
                    <Dialog
                        open={editDialogOpen}
                        onClose={() => setEditDialogOpen(false)}
                        PaperProps={{ sx: { borderRadius: 4, p: 1, width: '100%', maxWidth: 450 } }}
                    >
                        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.25rem' }}>Edit Reservation #{selectedReservation?.reservationId}</DialogTitle>
                        <Divider sx={{ mx: 3 }} />
                        <DialogContent>
                            <Stack spacing={3} sx={{ mt: 1 }}>
                                <Box>
                                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', mb: 1, display: 'block' }}>
                                        Vendor Details
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>{selectedReservation?.businessName}</Typography>
                                    <Typography variant="caption" color="text.secondary">{selectedReservation?.email}</Typography>
                                </Box>

                                <TextField
                                    label="Total Amount (Rs.)"
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    value={editData.totalAmount}
                                    onChange={(e) => setEditData({ ...editData, totalAmount: e.target.value })}
                                />

                                <TextField
                                    select
                                    label="Reservation Status"
                                    fullWidth
                                    value={editData.reservationStatus}
                                    onChange={(e) => setEditData({ ...editData, reservationStatus: e.target.value })}
                                >
                                    <MenuItem value="PENDING">PENDING</MenuItem>
                                    <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
                                    <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                                </TextField>
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
                            <Button onClick={() => setEditDialogOpen(false)} color="inherit" sx={{ fontWeight: 700, textTransform: 'none' }}>Cancel</Button>
                            <Button
                                onClick={handleEditSave}
                                variant="contained"
                                color="primary"
                                sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none', px: 4 }}
                                disableElevation
                            >
                                Save Changes
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
            <SiteFooter />
        </Box>
    );
};

export default AdminReservations;
