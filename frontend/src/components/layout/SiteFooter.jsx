import React from 'react';
import {
    Box,
    Button,
    Container,
    Divider,
    Grid,
    IconButton,
    Link,
    Paper,
    Stack,
    Typography,
    alpha,
    useTheme,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from 'lucide-react';

import Logo from '../common/Logo';

const SiteFooter = () => {
    const theme = useTheme();
    const year = new Date().getFullYear();

    return (
        <Paper
            component="footer"
            square
            elevation={0}
            sx={{
                mt: { xs: 8, md: 12 },
                py: { xs: 6, md: 8 },
                bgcolor: 'background.paper',
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Decorative Top Line */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                }}
            />

            <Container maxWidth="xl">
                <Grid container spacing={{ xs: 5, md: 8 }}>
                    {/* Brand Section */}
                    <Grid item xs={12} md={4}>
                        <Stack spacing={3}>
                            <Logo variant="footer" />
                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, lineHeight: 1.7, fontSize: '0.95rem' }}>
                                The official reservation platform for the Colombo International Bookfair. Empowering publishers and vendors with seamless stall management tools.
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                {[
                                    { icon: <Facebook size={20} />, label: "Facebook" },
                                    { icon: <Instagram size={20} />, label: "Instagram" },
                                    { icon: <Twitter size={20} />, label: "Twitter" }
                                ].map((social, index) => (
                                    <IconButton
                                        key={index}
                                        size="small"
                                        aria-label={social.label}
                                        sx={{
                                            color: 'text.secondary',
                                            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                            '&:hover': { color: 'primary.main', borderColor: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05) }
                                        }}
                                    >
                                        {social.icon}
                                    </IconButton>
                                ))}
                            </Stack>
                        </Stack>
                    </Grid>

                    {/* Links Section */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 3, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'text.primary' }}>
                            Platform
                        </Typography>
                        <Stack spacing={1.5}>
                            <Link component={RouterLink} to="/" underline="none" color="text.secondary" sx={{ transition: 'color 0.2s', '&:hover': { color: 'primary.main', pl: 0.5 } }}>Home</Link>
                            <Link component={RouterLink} to="/register" underline="none" color="text.secondary" sx={{ transition: 'color 0.2s', '&:hover': { color: 'primary.main', pl: 0.5 } }}>Vendor Registration</Link>
                            <Link component={RouterLink} to="/login" underline="none" color="text.secondary" sx={{ transition: 'color 0.2s', '&:hover': { color: 'primary.main', pl: 0.5 } }}>Vendor Login</Link>
                            <Link component={RouterLink} to="/features" underline="none" color="text.secondary" sx={{ transition: 'color 0.2s', '&:hover': { color: 'primary.main', pl: 0.5 } }}>Features</Link>
                        </Stack>
                    </Grid>

                    {/* Support Section */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 3, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'text.primary' }}>
                            Contact Us
                        </Typography>
                        <Stack spacing={2}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Mail size={18} color={theme.palette.text.secondary} />
                                <Typography variant="body2" color="text.secondary">support@bookfair.lk</Typography>
                            </Stack>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Phone size={18} color={theme.palette.text.secondary} />
                                <Typography variant="body2" color="text.secondary">+94 11 234 5678</Typography>
                            </Stack>
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                <MapPin size={18} color={theme.palette.text.secondary} style={{ marginTop: 2 }} />
                                <Typography variant="body2" color="text.secondary">
                                    BMICH, Bauddhaloka Mawatha,<br />Colombo 07, Sri Lanka
                                </Typography>
                            </Stack>
                        </Stack>
                    </Grid>

                    {/* CTA Section */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={0} sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 3, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
                            <Typography variant="subtitle2" fontWeight={800} gutterBottom>
                                Ready to exhibit?
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                                Secure your stall today and reach thousands of readers.
                            </Typography>
                            <Button
                                component={RouterLink}
                                to="/register"
                                variant="contained"
                                fullWidth
                                size="small"
                                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                            >
                                Register Now
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, borderColor: alpha(theme.palette.divider, 0.1) }} />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                        © {year} BookFair Reservation System. All rights reserved.
                    </Typography>
                    <Stack direction="row" spacing={3}>
                        <Link component={RouterLink} to="/terms" underline="hover" variant="caption" color="text.secondary">
                            Terms of Service
                        </Link>
                        <Link component={RouterLink} to="/privacy" underline="hover" variant="caption" color="text.secondary">
                            Privacy Policy
                        </Link>
                    </Stack>
                </Stack>
            </Container>
        </Paper>
    );
};

export default SiteFooter;
