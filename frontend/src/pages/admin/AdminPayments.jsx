import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, Box, Chip
} from '@mui/material';
import { getAllPayments, confirmCashPayment } from '../../api/dashboardApi';

const AdminPayments = () => {
    const [payments, setPayments] = useState([]);

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
        <Box p={3}>
            <Typography variant="h4" gutterBottom>View Payments</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Method</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell>{payment.id}</TableCell>
                                <TableCell>${payment.amount}</TableCell>
                                <TableCell>{payment.paymentMethod}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={payment.status}
                                        color={payment.status === 'COMPLETED' ? 'success' : 'warning'}
                                    />
                                </TableCell>
                                <TableCell>
                                    {payment.status === 'PENDING' && payment.paymentMethod === 'CASH' && (
                                        <Button variant="contained" size="small" onClick={() => handleConfirm(payment.id)}>
                                            Confirm Cash
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AdminPayments;
