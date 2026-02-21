import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Container,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    Toolbar,
    Typography,
    Tooltip,
    useTheme,
    alpha,
} from '@mui/material';
import {
    LayoutDashboard,
    CalendarCheck,
    FileBarChart,
    LogOut,
    Bell,
    Settings,
    ShieldCheck,
    Menu as MenuIcon,
    Store,
    User,
    Grid
} from 'lucide-react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Logo from '../common/Logo';

const AdminNavbar = ({ onLogout, userName }) => {
    const theme = useTheme();
    const location = useLocation();
    const [anchorElUser, setAnchorElUser] = useState(null);

    const navLinks = [
        { label: 'Dashboard', to: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
        { label: 'Vendors', to: '/admin/vendors', icon: <User size={18} /> },
        { label: 'Reservations', to: '/admin/reservations', icon: <CalendarCheck size={18} /> },
        { label: 'Payments', to: '/admin/payments', icon: <Store size={18} /> }, // Using Store as placeholder for Payments
        { label: 'Genres', to: '/admin/genres', icon: <Grid size={18} /> },
        { label: 'Stalls', to: '/admin/stalls', icon: <Store size={18} /> },
        { label: 'Add Stall', to: '/admin/insert-stall', icon: <Store size={18} /> },
    ];

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                width: '100%',
                backgroundColor: theme.palette.background.paper, // Dark theme consideration needed if admin uses dark mode
                color: theme.palette.text.primary,
                borderBottom: `1px solid ${theme.palette.divider}`,
                zIndex: theme.zIndex.drawer + 1,
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ height: 64 }}>
                    {/* Logo / Admin Branding */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                        <Logo />
                    </Box>

                    {/* Mobile Menu Icon */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="open drawer"
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>

                    {/* Desktop Nav Links */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1, bgcolor: alpha(theme.palette.secondary.main, 0.04), p: 0.5, borderRadius: '50px', border: `1px solid ${alpha(theme.palette.divider, 0.05)}` }}>
                            {navLinks.map((link) => (
                                <Button
                                    key={link.label}
                                    component={RouterLink}
                                    to={link.to}
                                    startIcon={link.icon}
                                    sx={{
                                        px: 3,
                                        py: 0.8,
                                        borderRadius: '50px',
                                        color: isActive(link.to) ? 'secondary.main' : 'text.secondary',
                                        fontWeight: isActive(link.to) ? 700 : 600,
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        backgroundColor: isActive(link.to) ? 'white' : 'transparent',
                                        boxShadow: isActive(link.to) ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                                        '&:hover': {
                                            color: 'secondary.main',
                                            bgcolor: 'white',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                        },
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {link.label}
                                </Button>
                            ))}
                        </Box>
                    </Box>

                    {/* Right Side Actions */}
                    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Tooltip title="Notifications">
                            <IconButton
                                size="large"
                                color="inherit"
                                sx={{ color: 'text.secondary', '&:hover': { color: 'secondary.main', backgroundColor: alpha(theme.palette.secondary.main, 0.08) } }}
                            >
                                <Bell />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
                                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                    {userName ? userName.charAt(0).toUpperCase() : 'A'}
                                </Avatar>
                            </IconButton>
                        </Tooltip>

                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    minWidth: 180,
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                        >
                            <Box sx={{ px: 2, py: 1.5 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {userName || 'Admin'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Administrator
                                </Typography>
                            </Box>
                            <Divider />
                            <MenuItem component={RouterLink} to="/admin/profile" onClick={handleCloseUserMenu}>
                                <ListItemIcon>
                                    <User size={18} />
                                </ListItemIcon>
                                My Profile
                            </MenuItem>
                            <MenuItem component={RouterLink} to="/admin/edit-profile" onClick={handleCloseUserMenu}>
                                <ListItemIcon>
                                    <Settings size={18} />
                                </ListItemIcon>
                                Edit Profile
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={() => { handleCloseUserMenu(); onLogout && onLogout(); }}>
                                <ListItemIcon>
                                    <LogOut size={18} color={theme.palette.error.main} />
                                </ListItemIcon>
                                <Typography color="error">Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

AdminNavbar.propTypes = {
    onLogout: PropTypes.func,
    userName: PropTypes.string,
};

AdminNavbar.defaultProps = {
    onLogout: undefined,
    userName: 'Admin',
};

export default AdminNavbar;
