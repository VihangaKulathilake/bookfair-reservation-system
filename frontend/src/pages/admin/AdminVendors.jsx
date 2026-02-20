import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, IconButton, TextField, Dialog, DialogActions, DialogContent,
    DialogTitle, Typography, Box, CircularProgress, Container, useTheme, alpha
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/layout/AdminNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import { getVendors, updateVendor, deleteVendor, getStoredAuth } from '../../api/dashboardApi';

const AdminVendors = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [formData, setFormData] = useState({ businessName: '', contactNumber: '' });
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

    const handleDeleteClick = async (id) => {
        if (window.confirm("Are you sure you want to delete this vendor? This will remove all their data from the system.")) {
            try {
                await deleteVendor(id);
                fetchVendors();
            } catch (error) {
                alert("Failed to delete vendor");
            }
        }
    };

    const handleUpdate = async () => {
        try {
            await updateVendor(selectedVendor.id, formData);
            setEditOpen(false);
            fetchVendors();
        } catch (error) {
            alert("Failed to update vendor");
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8f9fc' }}>
            <AdminNavbar userName={user?.contactPerson || user?.businessName || 'Admin'} onLogout={handleLogout} />

            <Box component="main" sx={{ flexGrow: 1, py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
                <Container maxWidth="xl">
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h4" fontWeight={800} color="text.primary">Manage Vendors</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>Overview of all registered businesses and contact details.</Typography>
                        </Box>
                        {loading && <CircularProgress size={24} color="secondary" />}
                    </Box>

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
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    size="small"
                                                    onClick={() => handleEditClick(vendor)}
                                                    sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 2, boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.2)}` }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleDeleteClick(vendor.id)}
                                                    sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 2 }}
                                                >
                                                    Delete
                                                </Button>
                                            </Box>
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
                                ) || loading && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                            <CircularProgress size={40} color="secondary" />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Dialog
                        open={editOpen}
                        onClose={() => setEditOpen(false)}
                        PaperProps={{
                            sx: { borderRadius: '24px', p: 1, maxWidth: '400px', width: '100%' }
                        }}
                    >
                        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Edit Vendor Details</DialogTitle>
                        <DialogContent>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Update business information for this vendor.</Typography>
                            <TextField
                                margin="dense"
                                label="Business Name"
                                fullWidth
                                variant="outlined"
                                value={formData.businessName}
                                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                            <TextField
                                margin="dense"
                                label="Contact Number"
                                fullWidth
                                variant="outlined"
                                value={formData.contactNumber}
                                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </DialogContent>
                        <DialogActions sx={{ p: 3, pt: 1 }}>
                            <Button onClick={() => setEditOpen(false)} sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, color: 'text.secondary' }}>Cancel</Button>
                            <Button onClick={handleUpdate} variant="contained" color="secondary" sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 4, boxShadow: `0 8px 16px ${alpha(theme.palette.secondary.main, 0.2)}` }}>Save Changes</Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
            <SiteFooter />
        </Box>
    );
};

export default AdminVendors;
