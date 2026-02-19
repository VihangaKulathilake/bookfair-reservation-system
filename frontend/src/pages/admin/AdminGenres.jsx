import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, Box, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getVendors, getGenresByVendor } from '../../api/dashboardApi';

const AdminGenres = () => {
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [genresMap, setGenresMap] = useState({});

    useEffect(() => {
        fetchVendorsAndGenres();
    }, []);

    const fetchVendorsAndGenres = async () => {
        try {
            const vendorsData = await getVendors();
            const vendorList = Array.isArray(vendorsData) ? vendorsData : [];
            setVendors(vendorList);

            const genresData = {};
            await Promise.all(vendorList.map(async (vendor) => {
                try {
                    const vendorGenres = await getGenresByVendor(vendor.email);
                    genresData[vendor.email] = Array.isArray(vendorGenres) ? vendorGenres : [];
                } catch (e) {
                    console.error(`Failed to fetch genres for ${vendor.email}`);
                    genresData[vendor.email] = [];
                }
            }));
            setGenresMap(genresData);
        } catch (error) {
            console.error("Failed to fetch data");
        }
    };

    return (
        <Box p={3}>
            <Button variant="outlined" onClick={() => navigate('/admin')} sx={{ mb: 2 }}>
                &larr; Back to Dashboard
            </Button>
            <Typography variant="h4" gutterBottom>View Vendor Genres</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Vendor Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Genres</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vendors.map((vendor) => (
                            <TableRow key={vendor.id}>
                                <TableCell>{vendor.businessName}</TableCell>
                                <TableCell>{vendor.email}</TableCell>
                                <TableCell>
                                    {genresMap[vendor.email]?.length > 0 ? (
                                        genresMap[vendor.email].map(g => g.name).join(", ")
                                    ) : (
                                        <Typography variant="caption" color="text.secondary">No genres</Typography>
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

export default AdminGenres;
