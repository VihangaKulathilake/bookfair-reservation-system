import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, Box, Container, useTheme, Chip, alpha, CircularProgress,
    Stack, IconButton, Tooltip, Divider, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, MenuItem
} from '@mui/material';
import { ArrowBack, DeleteOutline, Add, Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/layout/AdminNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import { getAllStalls, deleteStall, updateStall, getStoredAuth } from '../../api/dashboardApi';
import ModernAlert from '../../components/common/ModernAlert';

const AdminStalls = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [stalls, setStalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ open: false, title: '', message: '', severity: 'warning' });
    const [editOpen, setEditOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [stallToDelete, setStallToDelete] = useState(null);
    const [selectedStall, setSelectedStall] = useState(null);
    const user = getStoredAuth();

    useEffect(() => {
        fetchStalls();
    }, []);

    const fetchStalls = async () => {
        setLoading(true);
        try {
            const data = await getAllStalls();
            setStalls(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch stalls", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        setStallToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        const id = stallToDelete;
        try {
            await deleteStall(id);
            fetchStalls();
            setAlert({
                open: true,
                title: 'Stall Deleted',
                message: 'The stall has been successfully removed.',
                severity: 'success'
            });
        } catch (error) {
            setAlert({
                open: true,
                title: "Can't Delete Stall",
                message: error.response?.data?.message || "Can't delete active reservations.",
                severity: 'warning'
            });
        } finally {
            setDeleteConfirmOpen(false);
            setStallToDelete(null);
        }
    };

    const handleEditClick = (stall) => {
        setSelectedStall({ ...stall });
        setEditOpen(true);
    };

    const handleUpdateStall = async () => {
        try {
            await updateStall(selectedStall.stallId, selectedStall);
            setEditOpen(false);
            fetchStalls();
            setAlert({
                open: true,
                title: "Success",
                message: "Stall updated successfully.",
                severity: 'success'
            });
        } catch (error) {
            setAlert({
                open: true,
                title: "Update Failed",
                message: error.response?.data?.message || "Failed to update stall.",
                severity: 'error'
            });
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'AVAILABLE': return theme.palette.success;
            case 'RESERVED': return theme.palette.warning;
            case 'MAINTENANCE': return theme.palette.error;
            case 'BLOCKED': return theme.palette.grey;
            default: return theme.palette.grey;
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F5F7FA' }}>
            <AdminNavbar userName={user?.contactPerson || 'Admin'} onLogout={handleLogout} />

            <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
                <Stack spacing={3}>
                    {/* Header Section */}
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={2} alignItems="center">
                            <IconButton
                                onClick={() => navigate('/admin/dashboard')}
                                sx={{ bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', '&:hover': { bgcolor: '#f5f5f5' } }}
                            >
                                <ArrowBack />
                            </IconButton>
                            <Box>
                                <Typography variant="h4" fontWeight="800" color="text.primary">Stall Management</Typography>
                                <Typography variant="body2" color="text.secondary" fontWeight="500">View and manage book fair stall records</Typography>
                            </Box>
                        </Stack>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => navigate('/admin/insert-stall')}
                            sx={{
                                borderRadius: 2,
                                px: 3,
                                py: 1.2,
                                textTransform: 'none',
                                fontWeight: 700,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                background: 'linear-gradient(135deg, #4A148C 0%, #7B1FA2 100%)',
                            }}
                        >
                            Add New Stall
                        </Button>
                    </Box>

                    <Divider />

                    <ModernAlert
                        open={alert.open}
                        onClose={() => setAlert({ ...alert, open: false })}
                        title={alert.title}
                        message={alert.message}
                        severity={alert.severity}
                    />

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>Stall Code</TableCell>
                                        <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>Size</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>Price (LKR)</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>Status</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stalls.map((row) => (
                                        <TableRow key={row.stallId} sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) }, transition: 'background-color 0.2s' }}>
                                            <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>{row.stallCode}</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>{row.stallSize}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700 }}>
                                                {row.price?.toLocaleString()}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={row.stallStatus}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 700,
                                                        borderRadius: '6px',
                                                        bgcolor: alpha(getStatusColor(row.stallStatus).main, 0.1),
                                                        color: getStatusColor(row.stallStatus).dark,
                                                        border: `1px solid ${alpha(getStatusColor(row.stallStatus).main, 0.2)}`
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                    <Tooltip title="Edit Stall">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => handleEditClick(row)}
                                                            sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), '&:hover': { bgcolor: theme.palette.primary.main, color: 'white' } }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Stall">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDeleteClick(row.stallId)}
                                                            color="error"
                                                            sx={{ bgcolor: alpha(theme.palette.error.main, 0.05), '&:hover': { bgcolor: theme.palette.error.main, color: 'white' } }}
                                                        >
                                                            <DeleteOutline fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {stalls.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                                <Typography color="text.secondary" fontWeight="500">No stalls found in the system</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Stack>
            </Container>

            {/* Edit Stall Dialog */}
            <Dialog
                open={editOpen}
                onClose={() => setEditOpen(false)}
                PaperProps={{
                    sx: { borderRadius: 3, p: 1, minWidth: 400 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 800 }}>Edit Stall Detail</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Stall Code"
                            fullWidth
                            value={selectedStall?.stallCode || ''}
                            onChange={(e) => setSelectedStall({ ...selectedStall, stallCode: e.target.value })}
                        />
                        <TextField
                            select
                            label="Size"
                            fullWidth
                            value={selectedStall?.stallSize || ''}
                            onChange={(e) => setSelectedStall({ ...selectedStall, stallSize: e.target.value })}
                        >
                            <MenuItem value="SMALL">Small</MenuItem>
                            <MenuItem value="MEDIUM">Medium</MenuItem>
                            <MenuItem value="LARGE">Large</MenuItem>
                        </TextField>
                        <TextField
                            label="Price (LKR)"
                            type="number"
                            fullWidth
                            value={selectedStall?.price || ''}
                            onChange={(e) => setSelectedStall({ ...selectedStall, price: parseFloat(e.target.value) })}
                        />
                        <TextField
                            select
                            label="Status"
                            fullWidth
                            value={selectedStall?.stallStatus || ''}
                            onChange={(e) => setSelectedStall({ ...selectedStall, stallStatus: e.target.value })}
                        >
                            <MenuItem value="AVAILABLE">Available</MenuItem>
                            <MenuItem value="RESERVED">Reserved</MenuItem>
                            <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                            <MenuItem value="BLOCKED">Blocked</MenuItem>
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setEditOpen(false)} sx={{ fontWeight: 600 }}>Cancel</Button>
                    <Button
                        onClick={handleUpdateStall}
                        variant="contained"
                        sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}
                    >
                        Update Stall
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 800 }}>Confirm Stall Deletion</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Are you sure you want to delete this stall? This action cannot be undone if there are no active dependencies.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setDeleteConfirmOpen(false)} sx={{ fontWeight: 700, color: 'text.secondary' }}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} variant="contained" color="error" sx={{ fontWeight: 700, borderRadius: 2, px: 3 }}>
                        Delete Stall
                    </Button>
                </DialogActions>
            </Dialog>

            <SiteFooter />
        </Box>
    );
};

export default AdminStalls;
