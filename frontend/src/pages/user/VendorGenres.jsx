import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, Box, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Container, useTheme, Stack, IconButton, Tooltip, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/layout/UserNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import { getGenresByVendor, createGenre, updateGenre, deleteGenre, getStoredAuth } from '../../api/dashboardApi';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, LibraryBooks } from '@mui/icons-material';
import ModernAlert from '../../components/common/ModernAlert';

const VendorGenres = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [genres, setGenres] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: '' });
    const [user] = useState(getStoredAuth());
    const [alert, setAlert] = useState({ open: false, title: '', message: '', severity: 'error' });
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

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
        if (!formData.name.trim()) return;
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
            setAlert({
                open: true,
                title: 'Save Failed',
                message: 'Failed to save genre. Please try again.',
                severity: 'error'
            });
        }
    };

    const handleDeleteClick = (id) => {
        setConfirmDelete({ open: true, id });
    };

    const handleDeleteConfirm = async () => {
        const id = confirmDelete.id;
        try {
            await deleteGenre(id);
            setAlert({
                open: true,
                title: 'Deleted',
                message: 'Genre deleted successfully.',
                severity: 'success'
            });
            fetchGenres();
        } catch (error) {
            setAlert({
                open: true,
                title: 'Delete Failed',
                message: 'Failed to delete genre.',
                severity: 'error'
            });
        }
        setConfirmDelete({ open: false, id: null });
    };

    const handleEdit = (genre) => {
        setFormData({ id: genre.id, name: genre.name });
        setOpen(true);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
            <UserNavbar userName={user?.businessName || 'Vendor'} onLogout={handleLogout} />

            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
                <Container maxWidth="lg">
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" mb={4} gap={2}>
                        <Box>
                            <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ letterSpacing: '-0.5px' }}>
                                My Genres
                            </Typography>
                            <Typography variant="body1" color="text.secondary" mt={0.5}>
                                Manage the literary genres for your bookstore
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<AddIcon />}
                            onClick={() => {
                                setFormData({ id: null, name: '' });
                                setOpen(true);
                            }}
                            sx={{ borderRadius: 2, px: 3, py: 1, fontWeight: 700, textTransform: 'none', boxShadow: theme.shadows[4] }}
                        >
                            Add Genre
                        </Button>
                    </Stack>

                    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <Table sx={{ minWidth: 650 }} aria-label="genres table">
                            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Genre Name</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {genres.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center" sx={{ py: 8 }}>
                                            <LibraryBooks sx={{ fontSize: 48, color: 'text.disabled', mb: 1, opacity: 0.5 }} />
                                            <Typography variant="body1" color="text.secondary" fontWeight={500}>
                                                No genres added yet.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    genres.map((genre) => (
                                        <TableRow
                                            key={genre.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.2s' }}
                                        >
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={600} color="text.primary">
                                                    {genre.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                    <Tooltip title="Edit Genre">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleEdit(genre)}
                                                            sx={{ color: 'primary.main', bgcolor: 'primary.light', '&:hover': { bgcolor: 'primary.main', color: 'white' }, opacity: 0.8 }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Genre">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDeleteClick(genre.id)}
                                                            sx={{ color: 'error.main', bgcolor: 'error.light', '&:hover': { bgcolor: 'error.main', color: 'white' }, opacity: 0.8 }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Dialog
                        open={open}
                        onClose={() => setOpen(false)}
                        PaperProps={{ sx: { borderRadius: 3, p: 1, width: '100%', maxWidth: 400 } }}
                    >
                        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>{formData.id ? 'Edit Genre' : 'Add New Genre'}</DialogTitle>
                        <Divider sx={{ mx: 3 }} />
                        <DialogContent sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary" mb={2}>
                                {formData.id ? 'Modify the name of your existing genre.' : 'Enter a name for the new literary genre.'}
                            </Typography>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Genre Name"
                                placeholder="e.g. Science Fiction"
                                fullWidth
                                variant="outlined"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2 }}>
                            <Button onClick={() => setOpen(false)} color="inherit" sx={{ fontWeight: 600, textTransform: 'none' }}>Cancel</Button>
                            <Button
                                onClick={handleSave}
                                variant="contained"
                                disableElevation
                                sx={{ fontWeight: 700, borderRadius: 2, textTransform: 'none', px: 3 }}
                            >
                                {formData.id ? 'Update' : 'Add Genre'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <ModernAlert
                        open={alert.open}
                        title={alert.title}
                        message={alert.message}
                        severity={alert.severity}
                        onClose={() => setAlert({ ...alert, open: false })}
                    />

                    <Dialog
                        open={confirmDelete.open}
                        onClose={() => setConfirmDelete({ open: false, id: null })}
                        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
                    >
                        <DialogTitle sx={{ fontWeight: 700 }}>Delete Genre?</DialogTitle>
                        <DialogContent>
                            <Typography>Are you sure you want to delete this genre? This action cannot be undone.</Typography>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2 }}>
                            <Button onClick={() => setConfirmDelete({ open: false, id: null })} color="inherit" sx={{ fontWeight: 600 }}>Cancel</Button>
                            <Button onClick={handleDeleteConfirm} variant="contained" color="error" disableElevation sx={{ fontWeight: 600, borderRadius: 2 }}>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
            <SiteFooter />
        </Box>
    );
};

export default VendorGenres;
