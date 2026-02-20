import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Container, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Map, QrCode, ArrowRight, Layers } from 'lucide-react';
import Logo from '../common/Logo';

const HeroSection = () => {
    const theme = useTheme();

    // Removed the problematic imageTiles logic for now as it was causing issues.
    // We can re-enable this or replace with a static image / illustration later.

    return (
        <Box
            sx={{
                position: 'relative',
                overflow: 'hidden',
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 55%, ${theme.palette.secondary.main} 120%)`,
                pt: { xs: 12, md: 16 },
                pb: { xs: 8, md: 12 },
                clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0% 100%)', // Modern diagonal cut
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: -120,
                    right: -80,
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: alpha(theme.palette.common.white, 0.1),
                    filter: 'blur(60px)',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -50,
                    left: -50,
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: alpha(theme.palette.secondary.main, 0.2),
                    filter: 'blur(40px)',
                }}
            />
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="h1" // Upgraded to h1 for SEO
                            sx={{
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                                color: 'white',
                                fontWeight: 800,
                                lineHeight: 1.1,
                                mb: 2,
                                animation: 'heroFade 800ms ease-out',
                                '@keyframes heroFade': {
                                    from: { opacity: 0, transform: 'translateY(20px)' },
                                    to: { opacity: 1, transform: 'translateY(0)' },
                                },
                            }}
                        >
                            Colombo International Bookfair <br />
                            <Box component="span" sx={{ color: alpha(theme.palette.common.white, 0.8) }}>Reservation Portal</Box>
                        </Typography>
                        <Typography sx={{ color: alpha(theme.palette.common.white, 0.9), mb: 4, fontSize: '1.2rem', maxWidth: 600 }}>
                            Join the biggest literary event of the year. Reserve your improved exhibition stalls, manage your inventory, and connect with millions of readers.
                        </Typography>

                        <Stack direction="row" spacing={2} sx={{ mb: 5 }}>
                            <Button
                                component={RouterLink}
                                to="/register"
                                variant="contained"
                                size="large"
                                endIcon={<ArrowRight />}
                                sx={{
                                    borderRadius: '50px',
                                    py: 1.5,
                                    px: 4,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    color: theme.palette.primary.main,
                                    backgroundColor: 'white',
                                    textTransform: 'none',
                                    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.common.white, 0.95),
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px 0 rgba(0,0,0,0.15)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Get Started
                            </Button>
                            <Button
                                component={RouterLink}
                                to="/login"
                                variant="outlined"
                                size="large"
                                sx={{
                                    borderRadius: '50px',
                                    py: 1.5,
                                    px: 4,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    borderColor: alpha(theme.palette.common.white, 0.5),
                                    color: 'white',
                                    textTransform: 'none',
                                    '&:hover': {
                                        borderColor: 'white',
                                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Sign In
                            </Button>
                        </Stack>

                        <Stack direction="row" spacing={3} sx={{ color: 'white', opacity: 0.9 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Map size={20} /> <Typography variant="body2" fontWeight={600}>Interactive Map</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Layers size={20} /> <Typography variant="body2" fontWeight={600}>Easy Management</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <QrCode size={20} /> <Typography variant="body2" fontWeight={600}>Instant Access</Typography>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default HeroSection;
