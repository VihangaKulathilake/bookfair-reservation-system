import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, Box, Button, Container, useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/layout/AdminNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import { getVendors, getGenresByVendor, getStoredAuth } from '../../api/dashboardApi';

const AdminGenres = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [genresMap, setGenresMap] = useState({});
    const user = getStoredAuth();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

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
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
            <AdminNavbar userName={user?.businessName || 'Admin'} onLogout={handleLogout} />

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Container maxWidth="xl">
                    <Button variant="outlined" onClick={() => navigate('/admin')} sx={{ mb: 2 }}>
                        &larr; Back to Dashboard
                    </Button>
                    <Typography variant="h4" gutterBottom>View Vendor Genres</Typography>
                    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Vendor Name</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Genres</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {vendors.map((vendor) => (
                                    <TableRow
                                        key={vendor.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.2s' }}
                                    >
                                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>{vendor.businessName}</TableCell>
                                        <TableCell>{vendor.email}</TableCell>
                                        <TableCell>
                                            {genresMap[vendor.email]?.length > 0 ? (
                                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                    {genresMap[vendor.email].map((g, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={g.name}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{
                                                                borderRadius: 1,
                                                                bgcolor: 'background.paper',
                                                                borderColor: 'divider',
                                                                fontWeight: 500
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            ) : (
                                                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>No genres listed</Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {vendors.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                                            <Typography variant="body1" color="text.secondary" fontWeight={500}>
                                                No vendors found.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </Box>
            <SiteFooter />
        </Box>
    );
};

export default AdminGenres;
