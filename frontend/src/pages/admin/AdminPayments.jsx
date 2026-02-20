import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, Box, Chip, Container, useTheme, Stack, IconButton, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Divider, alpha, CircularProgress,
    Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/layout/AdminNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import { getAllPayments, confirmCashPayment, updatePayment, deletePayment, getStoredAuth } from '../../api/dashboardApi';
import { Edit as EditIcon, Delete as DeleteIcon, CheckCircle } from '@mui/icons-material';
import ModernAlert from '../../components/common/ModernAlert';

const AdminPayments = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [editData, setEditData] = useState({ amount: '', paymentStatus: '', paymentMethod: '', transactionId: '' });
    const [alert, setAlert] = useState({ open: false, title: '', message: '', severity: 'warning' });
    const user = getStoredAuth();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const data = await getAllPayments();
            setPayments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch payments", error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (id) => {
        if (window.confirm("Confirm this cash payment?")) {
            try {
                await confirmCashPayment(id);
                fetchPayments();
                setAlert({ open: false });
            } catch (error) {
                setAlert({
                    open: true,
                    title: 'Verification Failed',
                    message: error.response?.data?.message || "Failed to verify the cash payment. Please check system logs.",
                    severity: 'error'
                });
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this payment record?")) {
            try {
                await deletePayment(id);
                fetchPayments();
                setAlert({ open: false });
            } catch (error) {
                setAlert({
                    open: true,
                    title: "Can't Delete Payment",
                    message: error.response?.data?.message || "Can't delete pending payments.",
                    severity: 'warning'
                });
            }
        }
    };

    const handleEditClick = (payment) => {
        setSelectedPayment(payment);
        setEditData({
            amount: payment.amount || 0,
            paymentStatus: payment.paymentStatus,
            paymentMethod: payment.paymentMethod,
            transactionId: payment.transactionId || ''
        });
        setEditDialogOpen(true);
    };

    const handleEditSave = async () => {
        try {
            await updatePayment(selectedPayment.paymentId, {
                amount: parseFloat(editData.amount),
                paymentStatus: editData.paymentStatus,
                paymentMethod: editData.paymentMethod,
                transactionId: editData.transactionId
            });
            setEditDialogOpen(false);
            fetchPayments();
            setAlert({ open: false });
        } catch (error) {
            setAlert({
                open: true,
                title: 'Update Failed',
                message: error.response?.data?.message || "Could not update the payment record. Please check the provided details.",
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
                            <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ letterSpacing: '-0.5px' }}>View Payments</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>Manage and track all financial transactions and payments.</Typography>
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
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', py: 2.5 }}>Vendor Details</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', py: 2.5 }}>Stalls</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', py: 2.5 }}>Amount</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', py: 2.5 }}>Method</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', py: 2.5 }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', py: 2.5 }}>Status</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', py: 2.5, pr: 4 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {payments.map((payment) => (
                                    <TableRow
                                        key={payment.paymentId}
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            '&:hover': { bgcolor: alpha(theme.palette.secondary.main, 0.01) },
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 700, color: 'secondary.main', fontSize: '0.9rem' }}>#{payment.paymentId}</TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2" fontWeight={700} color="text.primary">
                                                    {payment.businessName || 'Guest'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {payment.email || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {payment.stallCodes && payment.stallCodes.length > 0 ? (
                                                <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                                                    {payment.stallCodes.map(code => (
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
                                                <Typography variant="caption" color="text.disabled">No stalls</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 800, color: 'text.primary' }}>
                                            Rs. {payment.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={payment.paymentMethod}
                                                size="small"
                                                sx={{
                                                    borderRadius: 1.5,
                                                    fontWeight: 800,
                                                    fontSize: '0.6rem',
                                                    bgcolor: payment.paymentMethod === 'CASH' ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.info.main, 0.1),
                                                    color: payment.paymentMethod === 'CASH' ? 'primary.main' : 'info.main',
                                                    border: `1px solid ${alpha(payment.paymentMethod === 'CASH' ? theme.palette.primary.main : theme.palette.info.main, 0.2)}`
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {new Date(payment.paymentDate).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(payment.paymentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={payment.paymentStatus}
                                                size="small"
                                                sx={{
                                                    borderRadius: '10px',
                                                    fontWeight: 800,
                                                    fontSize: '0.65rem',
                                                    letterSpacing: '0.5px',
                                                    minWidth: 90,
                                                    textTransform: 'uppercase',
                                                    ...(payment.paymentStatus === 'SUCCESS' ? {
                                                        bgcolor: alpha(theme.palette.success.main, 0.1),
                                                        color: theme.palette.success.dark,
                                                        border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                                                    } : payment.paymentStatus === 'FAILED' ? {
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
                                                {payment.paymentStatus === 'PENDING' && payment.paymentMethod === 'CASH' && (
                                                    <Tooltip title="Verify Cash Payment">
                                                        <IconButton
                                                            size="small"
                                                            color="success"
                                                            onClick={() => handleConfirm(payment.paymentId)}
                                                            sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), '&:hover': { bgcolor: theme.palette.success.main, color: 'white' } }}
                                                        >
                                                            <CheckCircle fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                <Tooltip title="Edit Payment">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleEditClick(payment)}
                                                        sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), '&:hover': { bgcolor: theme.palette.primary.main, color: 'white' } }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Record">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDelete(payment.paymentId)}
                                                        sx={{ bgcolor: alpha(theme.palette.error.main, 0.05), '&:hover': { bgcolor: theme.palette.error.main, color: 'white' } }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!loading && payments.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                                            <Box sx={{ opacity: 0.5 }}>
                                                <Typography variant="h6" fontWeight={700}>No Payments Found</Typography>
                                                <Typography variant="body2">Current filters returned no results.</Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) || loading && (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
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
                        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.25rem' }}>Edit Payment Record #{selectedPayment?.paymentId}</DialogTitle>
                        <Divider sx={{ mx: 3 }} />
                        <DialogContent>
                            <Stack spacing={3} sx={{ mt: 1 }}>
                                <Box>
                                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', mb: 1, display: 'block' }}>
                                        Vendor Details
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>{selectedPayment?.businessName}</Typography>
                                    <Typography variant="caption" color="text.secondary">{selectedPayment?.email}</Typography>
                                </Box>

                                <TextField
                                    label="Amount (Rs.)"
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    value={editData.amount}
                                    onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                                />

                                <TextField
                                    label="Transaction ID"
                                    fullWidth
                                    variant="outlined"
                                    value={editData.transactionId}
                                    onChange={(e) => setEditData({ ...editData, transactionId: e.target.value })}
                                />

                                <TextField
                                    select
                                    label="Payment Method"
                                    fullWidth
                                    value={editData.paymentMethod}
                                    onChange={(e) => setEditData({ ...editData, paymentMethod: e.target.value })}
                                >
                                    <MenuItem value="CASH">CASH</MenuItem>
                                    <MenuItem value="PAYPAL">PAYPAL</MenuItem>
                                </TextField>

                                <TextField
                                    select
                                    label="Payment Status"
                                    fullWidth
                                    value={editData.paymentStatus}
                                    onChange={(e) => setEditData({ ...editData, paymentStatus: e.target.value })}
                                >
                                    <MenuItem value="PENDING">PENDING</MenuItem>
                                    <MenuItem value="SUCCESS">SUCCESS</MenuItem>
                                    <MenuItem value="FAILED">FAILED</MenuItem>
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

export default AdminPayments;
