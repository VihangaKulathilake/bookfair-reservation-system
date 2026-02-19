import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, IconButton, TextField, Dialog, DialogActions, DialogContent,
    DialogTitle, Typography, Box, CircularProgress
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { getVendors, updateVendor, deleteVendor } from '../../api/dashboardApi';

const AdminVendors = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [formData, setFormData] = useState({ businessName: '', contactNumber: '' });

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
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
        if (window.confirm("Are you sure you want to delete this vendor?")) {
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

    if (loading) return <CircularProgress />;

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Manage Vendors</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Business Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vendors.map((vendor) => (
                            <TableRow key={vendor.id}>
                                <TableCell>{vendor.id}</TableCell>
                                <TableCell>{vendor.businessName}</TableCell>
                                <TableCell>{vendor.email}</TableCell>
                                <TableCell>{vendor.contactNumber}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEditClick(vendor)} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteClick(vendor.id)} color="error">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogTitle>Edit Vendor</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Business Name"
                        fullWidth
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Contact Number"
                        fullWidth
                        value={formData.contactNumber}
                        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdate} variant="contained">Update</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminVendors;
