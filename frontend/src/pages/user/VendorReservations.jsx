import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, Box, Chip
} from '@mui/material';
import { getReservationsByUserId, cancelReservation, getStoredAuth } from '../../api/dashboardApi';

const VendorReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [user] = useState(getStoredAuth());

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

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this reservation?")) {
            try {
                await cancelReservation(id);
                fetchReservations();
            } catch (error) {
                alert("Failed to cancel reservation");
            }
        }
    };

    return (
        <Box p={3}>
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
        </Box>
    );
};

export default VendorReservations;
