import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Box,
    Button,
    Container,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    useTheme,
    alpha,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home,
    Star,
    DollarSign,
    LogIn,
    UserPlus,
} from 'lucide-react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Logo from '../common/Logo';

const LandingNavbar = () => {
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'Home', to: '/', icon: <Home size={18} /> },
        { label: 'Features', to: '/#features', icon: <Star size={18} /> },
        { label: 'Contact', to: '/#contact', icon: <DollarSign size={18} /> },
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', height: '100%', bgcolor: 'background.default' }}>
            <Box sx={{ py: 3, display: 'flex', justifyContent: 'center', borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Logo />
            </Box>
            <List sx={{ p: 2 }}>
                {navLinks.map((item) => (
                    <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            component={RouterLink}
                            to={item.to}
                            sx={{ borderRadius: 2 }}
                        >
                            <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ p: 2, mt: 'auto' }}>
                <Button
                    fullWidth
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    startIcon={<LogIn size={18} />}
                    sx={{ mb: 2, borderRadius: 2, py: 1 }}
                >
                    Sign In
                </Button>
                <Button
                    fullWidth
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    startIcon={<UserPlus size={18} />}
                    sx={{ borderRadius: 2, py: 1 }}
                >
                    Register
                </Button>
            </Box>
        </Box>
    );

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: scrolled ? alpha(theme.palette.background.default, 0.8) : 'transparent',
                backdropFilter: 'blur(16px)',
                borderBottom: scrolled ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
                transition: 'all 0.3s ease',
                py: { xs: 1, md: 1.5 },
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>

                    {/* Logo Area */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Logo />
                    </Box>

                    {/* Mobile Menu Icon */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="open drawer"
                            edge="end"
                            onClick={handleDrawerToggle}
                            sx={{ color: 'text.primary' }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>

                    {/* Desktop Menu */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1, mr: 4, bgcolor: alpha(theme.palette.primary.main, 0.04), p: 0.5, borderRadius: '50px', border: `1px solid ${alpha(theme.palette.divider, 0.05)}` }}>
                            {navLinks.map((item) => (
                                <Button
                                    key={item.label}
                                    component={RouterLink}
                                    to={item.to}
                                    sx={{
                                        px: 3,
                                        py: 0.8,
                                        borderRadius: '50px',
                                        color: 'text.secondary',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        '&:hover': {
                                            color: 'primary.main',
                                            bgcolor: 'white',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                        }
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>

                        {/* Desktop Auth Buttons */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                component={RouterLink}
                                to="/login"
                                variant="text"
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    color: 'text.primary',
                                    '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
                                }}
                            >
                                Sign In
                            </Button>
                            <Button
                                component={RouterLink}
                                to="/register"
                                variant="contained"
                                disableElevation
                                sx={{
                                    borderRadius: '50px',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    px: 3,
                                    py: 1,
                                    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
                                    backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                    '&:hover': {
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 6px 20px 0 rgba(0,0,0,0.15)',
                                    },
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Get Started
                            </Button>
                        </Box>
                    </Box>
                </Toolbar>
            </Container>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 },
                }}
            >
                {drawer}
            </Drawer>
        </AppBar>
    );
};

export default LandingNavbar;
