import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, Box, Chip, Container, useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/layout/AdminNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import { getAllPayments, confirmCashPayment, getStoredAuth } from '../../api/dashboardApi';

const AdminPayments = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const user = getStoredAuth();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const data = await getAllPayments();
            setPayments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch payments", error);
        }
    };

    const handleConfirm = async (id) => {
        if (window.confirm("Confirm this cash payment?")) {
            try {
                await confirmCashPayment(id);
                fetchPayments();
            } catch (error) {
                alert("Failed to confirm payment");
            }
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
            <AdminNavbar userName={user?.businessName || 'Admin'} onLogout={handleLogout} />

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Container maxWidth="xl">
                    <Typography variant="h4" gutterBottom>View Payments</Typography>
                    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>User Details</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Stalls</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Amount</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Method</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2, textAlign: 'right' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {payments.map((payment) => (
                                    <TableRow
                                        key={payment.paymentId}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.2s' }}
                                    >
                                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>{payment.paymentId}</TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2" fontWeight={600} color="text.primary">
                                                    {payment.businessName || 'Guest'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                    {payment.email || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {payment.stallCodes && payment.stallCodes.length > 0 ? (
                                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', maxWidth: 200 }}>
                                                    {payment.stallCodes.map(code => (
                                                        <Chip
                                                            key={code}
                                                            label={code}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{
                                                                borderRadius: 1,
                                                                bgcolor: 'background.paper',
                                                                borderColor: 'divider',
                                                                fontWeight: 500
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            ) : (
                                                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                    No stalls assigned
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>
                                            Rs. {payment.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={payment.paymentMethod}
                                                size="small"
                                                sx={{
                                                    borderRadius: 1.5,
                                                    fontWeight: 600,
                                                    bgcolor: payment.paymentMethod === 'CASH' ? 'primary.soft' : 'info.soft',
                                                    color: payment.paymentMethod === 'CASH' ? 'primary.main' : 'info.main',
                                                    textTransform: 'uppercase',
                                                    fontSize: '0.7rem'
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
                                                color={payment.paymentStatus === 'SUCCESS' ? 'success' : payment.paymentStatus === 'FAILED' ? 'error' : 'warning'}
                                                size="small"
                                                variant={payment.paymentStatus === 'PENDING' ? 'outlined' : 'filled'}
                                                sx={{ borderRadius: 1.5, fontWeight: 700, minWidth: 80 }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            {payment.paymentStatus === 'PENDING' && payment.paymentMethod === 'CASH' ? (
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    onClick={() => handleConfirm(payment.paymentId)}
                                                    sx={{
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        boxShadow: theme.shadows[2],
                                                        px: 2
                                                    }}
                                                >
                                                    Verify Payment
                                                </Button>
                                            ) : (
                                                <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 500 }}>
                                                    {payment.paymentStatus === 'SUCCESS' ? 'Completed' : 'No Actions'}
                                                </Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {payments.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                                            <Typography variant="body1" color="text.secondary" fontWeight={500}>
                                                No payments found.
                                            </Typography>
                                            <Typography variant="caption" color="text.disabled">
                                                New payments will appear here.
                                            </Typography>
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

export default AdminPayments;
