import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, Box, Chip
} from '@mui/material';
import { getAllReservations, updateReservationStatus, deleteReservation } from '../../api/dashboardApi';

const AdminReservations = () => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const data = await getAllReservations();
            setReservations(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch reservations", error);
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
        if (window.confirm("Are you sure?")) {
            try {
                await deleteReservation(id);
                fetchReservations();
            } catch (error) {
                alert("Failed to delete reservation");
            }
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Review Reservations</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservations.map((res) => (
                            <TableRow key={res.id}>
                                <TableCell>{res.id}</TableCell>
                                <TableCell>{res?.user?.businessName || res?.user?.email}</TableCell>
                                <TableCell>{res.reservationDate}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={res.status}
                                        color={res.status === 'CONFIRMED' ? 'success' : res.status === 'CANCELLED' ? 'error' : 'warning'}
                                    />
                                </TableCell>
                                <TableCell>
                                    {res.status === 'PENDING' && (
                                        <>
                                            <Button size="small" variant="contained" color="success" onClick={() => handleStatusChange(res.id, 'CONFIRMED')} sx={{ mr: 1 }}>
                                                Approve
                                            </Button>
                                            <Button size="small" variant="outlined" color="error" onClick={() => handleStatusChange(res.id, 'CANCELLED')}>
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    {res.status === 'CONFIRMED' && (
                                        <Button size="small" variant="contained" color="error" onClick={() => handleDelete(res.id)}>
                                            Delete
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

export default AdminReservations;
