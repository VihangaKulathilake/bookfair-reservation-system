import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
    AppBar,
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    Stack,
    Toolbar,
    Typography,
    alpha,
    useTheme,
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const NavBar = ({ role, onLogout, userName, showBookingConfirmation }) => {
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navigation = useMemo(() => {
        if (role === 'admin') {
            return {
                links: [
                    { label: 'Dashboard', to: '/admin/dashboard' },
                    { label: 'Vendors', to: '/admin/vendors' },
                    { label: 'Reservations', to: '/admin/reservations' },
                    { label: 'Payments', to: '/admin/payments' },
                    { label: 'Genres', to: '/admin/genres' },
                    { label: 'Reports', to: '/admin/reports' },
                ],
                primaryAction: { label: 'Logout', action: onLogout },
            };
        }
        if (role === 'vendor' || role === 'user') { // Handling both 'vendor' (passed prop) and 'user' (legacy)
            const userLinks = [
                { label: 'Dashboard', to: '/user/dashboard' },
                { label: 'Reserve Stalls', to: '/user/stalls' },
                { label: 'My Reservations', to: '/user/vendor-reservations' },
                { label: 'My Genres', to: '/user/genres' },
                { label: 'Profile', to: '/user/profile' },
                { label: 'Settings', to: '/user/settings' },
            ];

            return {
                links: userLinks,
                bookingConfirmationAction: showBookingConfirmation
                    ? { label: 'Booking Confirmation', to: '/booking-confirmation' }
                    : null,
                primaryAction: { label: 'Logout', action: onLogout },
            };
        }
        return {
            links: [
                { label: 'Home', to: '/' },
                { label: 'Features', to: '/#features' },
                { label: 'Pricing', to: '/#pricing' },
            ],
            primaryAction: { label: 'Sign In', to: '/login' },
            secondaryAction: { label: 'Register', to: '/register' },
        };
    }, [role, onLogout, showBookingConfirmation]);

    const toggleMobile = () => setMobileOpen((prev) => !prev);

    const renderLinks = (variant = 'text', direction = 'row', onItemClick) => (
        <Stack direction={direction} spacing={1.5} alignItems="center">
            {navigation.links.map((link) => (
                <Button
                    key={link.label}
                    component={RouterLink}
                    to={link.to}
                    color="inherit"
                    variant={variant}
                    onClick={onItemClick}
                    sx={{ fontWeight: 600, textTransform: 'none', letterSpacing: 0.2 }}
                >
                    {link.label}
                </Button>
            ))}
        </Stack>
    );

    const renderActions = (onItemClick) => (
        <Stack direction="row" spacing={1} alignItems="center">
            {navigation.bookingConfirmationAction && (
                <Button
                    component={RouterLink}
                    to={navigation.bookingConfirmationAction.to}
                    variant="contained"
                    onClick={onItemClick}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: 2,
                        backgroundColor: '#d32f2f',
                        '&:hover': { backgroundColor: '#b71c1c' },
                    }}
                >
                    {navigation.bookingConfirmationAction.label}
                </Button>
            )}

            {navigation.secondaryAction && (
                <Button
                    component={RouterLink}
                    to={navigation.secondaryAction.to}
                    variant="outlined"
                    color="inherit"
                    onClick={onItemClick}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        borderColor: alpha(theme.palette.common.white, 0.65),
                        color: theme.palette.common.white,
                        '&:hover': { borderColor: theme.palette.common.white },
                    }}
                >
                    {navigation.secondaryAction.label}
                </Button>
            )}

            {navigation.primaryAction && navigation.primaryAction.to && (
                <Button
                    component={RouterLink}
                    to={navigation.primaryAction.to}
                    variant="contained"
                    color="secondary"
                    onClick={onItemClick}
                    sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                >
                    {navigation.primaryAction.label}
                </Button>
            )}

            {navigation.primaryAction && navigation.primaryAction.action && (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        navigation.primaryAction.action?.();
                        onItemClick?.();
                    }}
                    sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                >
                    {navigation.primaryAction.label}
                </Button>
            )}
        </Stack>
    );

    const drawer = (
        <Box sx={{ width: 260, p: 2, backgroundColor: theme.palette.background.default, height: '100%' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={800} color="primary.main">
                    BookFair
                </Typography>
                <IconButton onClick={toggleMobile} aria-label="Close navigation">
                    <CloseIcon />
                </IconButton>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
                {renderLinks('text', 'column', toggleMobile)}
                {renderActions(toggleMobile)}
            </Stack>
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="static"
                color="transparent"
                elevation={0}
                sx={{
                    backgroundColor: 'transparent',
                    backdropFilter: 'blur(6px)',
                    px: { xs: 1, md: 3 },
                    py: 1,
                }}
            >
                <Toolbar disableGutters sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography
                        component={RouterLink}
                        to="/"
                        variant="h6"
                        fontWeight={800}
                        color="primary.main"
                        sx={{ textDecoration: 'none', mr: 2 }}
                    >
                        BookFair
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {renderLinks()}
                    </Box>

                    {userName && (
                        <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' }, mr: 1.5 }}>
                            {userName}
                        </Typography>
                    )}

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                        {renderActions()}
                    </Box>

                    <IconButton
                        color="inherit"
                        edge="end"
                        onClick={toggleMobile}
                        sx={{ display: { md: 'none' }, ml: 1 }}
                        aria-label="Open navigation"
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer anchor="right" open={mobileOpen} onClose={toggleMobile} ModalProps={{ keepMounted: true }}>
                {drawer}
            </Drawer>
        </Box>
    );
};

NavBar.propTypes = {
    role: PropTypes.oneOf(['guest', 'user', 'admin']),
    onLogout: PropTypes.func,
    userName: PropTypes.string,
    showBookingConfirmation: PropTypes.bool,
};

NavBar.defaultProps = {
    role: 'guest',
    onLogout: undefined,
    userName: '',
    showBookingConfirmation: false,
};

export default NavBar;
