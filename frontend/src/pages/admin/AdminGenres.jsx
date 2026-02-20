import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, Box, Container, useTheme, Chip, alpha, CircularProgress,
    Stack, IconButton, Tooltip, Divider
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/layout/AdminNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import { getVendors, getGenresByVendor, getStoredAuth } from '../../api/dashboardApi';
import ModernAlert from '../../components/common/ModernAlert';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const AdminGenres = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [genresMap, setGenresMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ open: false, title: '', message: '', severity: 'info' });
    const user = getStoredAuth();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const vendorsData = await getVendors();
            const vendorList = Array.isArray(vendorsData) ? vendorsData : [];
            setVendors(vendorList);

            const genresData = {};
            // Fetch genres for all vendors in parallel
            await Promise.all(vendorList.map(async (v) => {
                try {
                    const res = await getGenresByVendor(v.email);
                    genresData[v.email] = Array.isArray(res) ? res : [];
                } catch (e) {
                    console.error(`Error fetching genres for ${v.email}`, e);
                    genresData[v.email] = [];
                }
            }));
            setGenresMap(genresData);
        } catch (error) {
            console.error("Failed to fetch genres data", error);
            setAlert({
                open: true,
                title: 'Data Fetch Error',
                message: "Can't load vendor genres. Please refresh the page.",
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8f9fc' }}>
            <AdminNavbar userName={user?.contactPerson || user?.businessName || 'Admin'} onLogout={handleLogout} />

            <Box component="main" sx={{ flexGrow: 1, py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
                <Container maxWidth="xl">
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Tooltip title="Back to Dashboard">
                                    <IconButton
                                        onClick={() => navigate('/admin')}
                                        size="small"
                                        sx={{ mr: 2, bgcolor: alpha(theme.palette.secondary.main, 0.1), color: 'secondary.main', '&:hover': { bgcolor: theme.palette.secondary.main, color: 'white' } }}
                                    >
                                        <ArrowBack fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ letterSpacing: '-0.5px' }}>Vendor Genres</Typography>
                            </Box>
                            <Typography variant="body1" color="text.secondary">Categories and genres listed by registered vendors.</Typography>
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
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', py: 2.5 }}>Vendor / Business</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', py: 2.5 }}>Contact Email</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', py: 2.5 }}>Assigned Genres</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', py: 2.5, pr: 4 }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {vendors.map((v) => (
                                    <TableRow
                                        key={v.id}
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            '&:hover': { bgcolor: alpha(theme.palette.secondary.main, 0.01) },
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={700} color="text.primary">{v.businessName || 'N/A'}</Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8 }}>ID: #{v.id}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={500}>{v.email}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                                                {genresMap[v.email]?.length > 0 ? (
                                                    genresMap[v.email].map((g, idx) => (
                                                        <Chip
                                                            key={idx}
                                                            label={g.name}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{
                                                                borderRadius: '8px',
                                                                fontWeight: 700,
                                                                fontSize: '0.7rem',
                                                                borderColor: alpha(theme.palette.secondary.main, 0.1),
                                                                bgcolor: alpha(theme.palette.secondary.main, 0.02)
                                                            }}
                                                        />
                                                    ))
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>No genres listed</Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right" sx={{ pr: 4 }}>
                                            <Chip
                                                label={genresMap[v.email]?.length > 0 ? "ACTIVE" : "NONE"}
                                                size="small"
                                                sx={{
                                                    borderRadius: '10px',
                                                    fontWeight: 800,
                                                    fontSize: '0.6rem',
                                                    bgcolor: genresMap[v.email]?.length > 0 ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.warning.main, 0.1),
                                                    color: genresMap[v.email]?.length > 0 ? 'success.dark' : 'warning.dark',
                                                    border: `1px solid ${alpha(genresMap[v.email]?.length > 0 ? theme.palette.success.main : theme.palette.warning.main, 0.2)}`
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!loading && vendors.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                                            <Box sx={{ opacity: 0.5 }}>
                                                <Typography variant="h6" fontWeight={700}>No Vendors Found</Typography>
                                                <Typography variant="body2">No vendor data available to display genres.</Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) || loading && (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                                            <CircularProgress size={40} color="secondary" />
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
