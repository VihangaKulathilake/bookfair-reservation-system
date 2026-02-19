// MyReservations Page
import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Grid,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    MenuItem
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import EmptyState from '../components/EmptyState';

// Dummy data for reservations
const initialReservations = [
    { id: 1, stall: 'A-12 (Small)', date: '2025-09-20', status: 'Confirmed', price: '$100' },
    { id: 2, stall: 'B-05 (Medium)', date: '2025-09-21', status: 'Pending', price: '$200' },
];

const MyReservation = () => {
    const [reservations, setReservations] = useState(initialReservations);
    const [openGenreDialog, setOpenGenreDialog] = useState(false);
    const [genres, setGenres] = useState([]);
    const [newGenre, setNewGenre] = useState('');

    const handleDelete = (id) => {
        setReservations(reservations.filter((r) => r.id !== id));
    };

    const handleAddGenre = () => {
        if (newGenre.trim()) {
            setGenres([...genres, newGenre]);
            setNewGenre('');
        }
    };

    if (reservations.length === 0) {
        return (
            <EmptyState
                title="No Reservations Yet"
                description="You haven't reserved any stalls for the book fair yet. Start by booking a stall to showcase your books."
                actionLabel="Book a Stall"
                onAction={() => console.log('Navigate to booking page')}
            />
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom color="primary">
                    My Reservations
                </Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpenGenreDialog(true)}>
                    Add Literary Genres
                </Button>
            </Box>

            <Grid container spacing={3}>
                {reservations.map((reservation) => (
                    <Grid item xs={12} sm={6} md={4} key={reservation.id}>
                        <Card elevation={3} sx={{ borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="h6" component="div">
                                        {reservation.stall}
                                    </Typography>
                                    <Chip
                                        label={reservation.status}
                                        color={reservation.status === 'Confirmed' ? 'success' : 'warning'}
                                        size="small"
                                        variant="outlined"
                                    />
                                </Box>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    Date: {reservation.date}
                                </Typography>
                                <Typography variant="body2">
                                    Price: {reservation.price}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                                <Button size="small" color="error" startIcon={<Delete />} onClick={() => handleDelete(reservation.id)}>
                                    Cancel
                                </Button>
                                <Button size="small" startIcon={<Edit />}>
                                    Modify
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Genre Dialog */}
            <Dialog open={openGenreDialog} onClose={() => setOpenGenreDialog(false)}>
                <DialogTitle>Add Literary Genres</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please list the literary genres you will be displaying/selling at the exhibition.
                    </DialogContentText>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Genre"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={newGenre}
                            onChange={(e) => setNewGenre(e.target.value)}
                        />
                        <Button onClick={handleAddGenre} variant="outlined">Add</Button>
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {genres.map((genre, index) => (
                            <Chip key={index} label={genre} onDelete={() => setGenres(genres.filter((_, i) => i !== index))} />
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenGenreDialog(false)}>Cancel</Button>
                    <Button onClick={() => setOpenGenreDialog(false)} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
export default MyReservation;
