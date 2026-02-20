import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, Box, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Container, useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/layout/UserNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import { getGenresByVendor, createGenre, updateGenre, deleteGenre, getStoredAuth } from '../../api/dashboardApi';

const VendorGenres = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [genres, setGenres] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: '' });
    const [user] = useState(getStoredAuth());

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    useEffect(() => {
        if (user?.email) {
            fetchGenres();
        }
    }, [user]);

    const fetchGenres = async () => {
        try {
            const data = await getGenresByVendor(user.email);
            setGenres(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch genres", error);
        }
    };

    const handleSave = async () => {
        try {
            const payload = {
                name: formData.name,
                vendorEmail: user.email
            };

            if (formData.id) {
                await updateGenre(formData.id, payload);
            } else {
                await createGenre(payload);
            }
            setOpen(false);
            setFormData({ id: null, name: '' });
            fetchGenres();
        } catch (error) {
            alert("Failed to save genre");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this genre?")) {
            try {
                await deleteGenre(id);
                fetchGenres();
            } catch (error) {
                alert("Failed to delete genre");
            }
        }
    };

    const handleEdit = (genre) => {
        setFormData({ id: genre.id, name: genre.name });
        setOpen(true);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
            <UserNavbar userName={user?.businessName || 'Vendor'} onLogout={handleLogout} />

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Container maxWidth="xl">
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="h4">My Genres</Typography>
                        <Button variant="contained" onClick={() => setOpen(true)}>Add Genre</Button>
                    </Box>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {genres.map((genre) => (
                                    <TableRow key={genre.id}>
                                        <TableCell>{genre.name}</TableCell>
                                        <TableCell align="right">
                                            <Button onClick={() => handleEdit(genre)}>Edit</Button>
                                            <Button color="error" onClick={() => handleDelete(genre.id)}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Dialog open={open} onClose={() => setOpen(false)}>
                        <DialogTitle>{formData.id ? 'Edit Genre' : 'Add Genre'}</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Genre Name"
                                fullWidth
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave} variant="contained">Save</Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
            <SiteFooter />
        </Box>
    );
};

export default VendorGenres;
