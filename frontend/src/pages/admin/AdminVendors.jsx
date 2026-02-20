import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, Box, CircularProgress, Container, useTheme, alpha,
    IconButton, Tooltip, Stack, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Button, Divider
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/layout/AdminNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import { getVendors, updateVendor, deleteVendor, getStoredAuth } from '../../api/dashboardApi';
import ModernAlert from '../../components/common/ModernAlert';

const AdminVendors = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [formData, setFormData] = useState({ businessName: '', contactNumber: '' });
    const [alert, setAlert] = useState({ open: false, title: '', message: '', severity: 'warning' });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [vendorToDelete, setVendorToDelete] = useState(null);
    const user = getStoredAuth();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const data = await getVendors();
            setVendors(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch vendors:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (vendor) => {
        setSelectedVendor(vendor);
        setFormData({
            businessName: vendor.businessName,
            contactNumber: vendor.contactNumber
        });
        setEditOpen(true);
    };

    const handleDeleteClick = (id) => {
        setVendorToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        const id = vendorToDelete;
        try {
            await deleteVendor(id);
            fetchVendors();
            setAlert({
                open: true,
                title: "Vendor Deleted",
                message: "The vendor has been successfully removed.",
                severity: 'success'
            });
        } catch (error) {
            const rawMessage = error.response?.data?.message || "";
            // Simplify technical messages
            let displayMessage = "Can't delete vendor. There are pending payments or active stalls.";

            if (rawMessage && !rawMessage.includes("org.hibernate") && !rawMessage.includes("Exception")) {
                displayMessage = rawMessage;
            }

            setAlert({
                open: true,
                title: "Can't Delete Vendor",
                message: displayMessage,
                severity: 'warning'
            });
        } finally {
            setDeleteConfirmOpen(false);
            setVendorToDelete(null);
        }
    };

    const handleUpdate = async () => {
        try {
            await updateVendor(selectedVendor.id, formData);
            setEditOpen(false);
            fetchVendors();
        } catch (error) {
            setAlert({
                open: true,
                title: "Update Failed",
                message: "Failed to update vendor information.",
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
                            <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ letterSpacing: '-0.5px' }}>Manage Vendors</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>Overview of all registered businesses and contact details.</Typography>
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
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', py: 2.5 }}>Business Name</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', py: 2.5 }}>Email Address</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', py: 2.5 }}>Contact Number</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', py: 2.5, pr: 4 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {vendors.map((vendor) => (
                                    <TableRow
                                        key={vendor.id}
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            '&:hover': { bgcolor: alpha(theme.palette.secondary.main, 0.01) },
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 700, color: 'secondary.main', fontSize: '0.9rem' }}>#{vendor.id}</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>{vendor.businessName}</TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>{vendor.email}</TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>{vendor.contactNumber || 'Not Provided'}</TableCell>
                                        <TableCell align="right" sx={{ pr: 4 }}>
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Tooltip title="Edit Vendor">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleEditClick(vendor)}
                                                        sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), '&:hover': { bgcolor: theme.palette.primary.main, color: 'white' } }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Vendor">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDeleteClick(vendor.id)}
                                                        sx={{ bgcolor: alpha(theme.palette.error.main, 0.05), '&:hover': { bgcolor: theme.palette.error.main, color: 'white' } }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!loading && vendors.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                            <Box sx={{ opacity: 0.5 }}>
                                                <Typography variant="h6" fontWeight={700}>No Vendors Found</Typography>
                                                <Typography variant="body2">Registers businesses will appear here.</Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {loading && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                            <CircularProgress size={40} color="secondary" />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Edit Vendor Dialog */}
                    <Dialog
                        open={editOpen}
                        onClose={() => setEditOpen(false)}
                        PaperProps={{
                            sx: { borderRadius: '24px', p: 1, maxWidth: '400px', width: '100%' }
                        }}
                    >
                        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Edit Vendor Details</DialogTitle>
                        <Divider sx={{ mx: 3 }} />
                        <DialogContent>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Update business information for this vendor.</Typography>
                            <Stack spacing={2.5}>
                                <TextField
                                    label="Business Name"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.businessName}
                                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                />
                                <TextField
                                    label="Contact Number"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.contactNumber}
                                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                />
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{ p: 3, pt: 1 }}>
                            <Button onClick={() => setEditOpen(false)} sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, color: 'text.secondary' }}>Cancel</Button>
                            <Button onClick={handleUpdate} variant="contained" color="secondary" sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 4, boxShadow: `0 8px 16px ${alpha(theme.palette.secondary.main, 0.2)}` }}>Save Changes</Button>
                        </DialogActions>
                    </Dialog>

                    {/* Delete Confirmation Dialog */}
                    <Dialog
                        open={deleteConfirmOpen}
                        onClose={() => setDeleteConfirmOpen(false)}
                        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
                    >
                        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Deletion</DialogTitle>
                        <DialogContent>
                            <Typography variant="body1">
                                Are you sure you want to delete this vendor? This will remove all their data from the system. This action cannot be undone.
                            </Typography>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2 }}>
                            <Button onClick={() => setDeleteConfirmOpen(false)} sx={{ fontWeight: 700, color: 'text.secondary' }}>Cancel</Button>
                            <Button onClick={handleDeleteConfirm} variant="contained" color="error" sx={{ fontWeight: 700, borderRadius: '12px', px: 3 }}>
                                Delete Vendor
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
            <SiteFooter />
        </Box>
    );
};

export default AdminVendors;
