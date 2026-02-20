import React, { useEffect, useState } from 'react';
import {
    Grid, Card, CardContent, Typography, Button, Box, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Chip, Alert, Container, useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/layout/UserNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import { getAvailableStalls, createReservation, getStoredAuth } from '../../api/dashboardApi';

const VendorStalls = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [stalls, setStalls] = useState([]);
    const [selectedStalls, setSelectedStalls] = useState([]);
    const [open, setOpen] = useState(false);
    const [user] = useState(getStoredAuth());

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    useEffect(() => {
        fetchStalls();
    }, []);

    const fetchStalls = async () => {
        try {
            const data = await getAvailableStalls();
            setStalls(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch stalls", error);
        }
    };

    const handleSelect = (stall) => {
        if (selectedStalls.includes(stall.id)) {
            setSelectedStalls(selectedStalls.filter(id => id !== stall.id));
        } else {
            if (selectedStalls.length >= 3) {
                alert("You can select up to 3 stalls only.");
                return;
            }
            setSelectedStalls([...selectedStalls, stall.id]);
        }
    };

    const handleReserve = async () => {
        if (!user) {
            alert("Please login first");
            return;
        }

        try {
            await createReservation({
                userId: user.userId,
                stallIds: selectedStalls
            });
            alert("Reservation created successfully!");
            setOpen(false);
            setSelectedStalls([]);
            fetchStalls();
        } catch (error) {
            alert("Failed to create reservation: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
            <UserNavbar userName={user?.businessName || 'Vendor'} onLogout={handleLogout} />

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Container maxWidth="xl">
                    <Typography variant="h4" gutterBottom>Browse Available Stalls</Typography>
                    <Box mb={2}>
                        <Button
                            variant="contained"
                            disabled={selectedStalls.length === 0}
                            onClick={() => setOpen(true)}
                        >
                            Reserve Selected ({selectedStalls.length})
                        </Button>
                    </Box>

                    <Grid container spacing={2}>
                        {stalls.map((stall) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stall.id}>
                                <Card
                                    sx={{
                                        border: selectedStalls.includes(stall.id) ? '2px solid blue' : '1px solid grey',
                                        cursor: 'pointer',
                                        height: '100%'
                                    }}
                                    onClick={() => handleSelect(stall)}
                                >
                                    <CardContent>
                                        <Typography variant="h6">{stall.stallName}</Typography>
                                        <Typography>Size: {stall.stallSize}</Typography>
                                        <Typography>Price: {stall.price}</Typography>
                                        <Typography>Location: {stall.location}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Dialog open={open} onClose={() => setOpen(false)}>
                        <DialogTitle>Confirm Reservation</DialogTitle>
                        <DialogContent>
                            <Typography>
                                You are about to reserve {selectedStalls.length} stall(s).
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)}>Cancel</Button>
                            <Button variant="contained" onClick={handleReserve}>Confirm</Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
            <SiteFooter />
        </Box>
    );
};

export default VendorStalls;
