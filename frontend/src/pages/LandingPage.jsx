import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Chip, Container, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NavBar from '../components/layout/NavBar';
import SiteFooter from '../components/layout/SiteFooter';

const LandingPage = () => {
    const theme = useTheme();
    const imageTiles = useMemo(
        () => [
            'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1455885666463-9c30fb24f6f7?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
        ],
        []
    );
    const [displayTiles, setDisplayTiles] = useState(imageTiles);

    useEffect(() => {
        const shuffleTiles = (tiles) => {
            const shuffled = [...tiles];
            for (let i = shuffled.length - 1; i > 0; i -= 1) {
                const randomIndex = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
            }
            return shuffled;
        };

        const interval = setInterval(() => {
            setDisplayTiles((prev) => shuffleTiles(prev));
        }, 5200);

        return () => clearInterval(interval);
    }, [imageTiles]);

    const steps = [
        'Register publisher or vendor profile',
        'Select up to 3 available stalls on venue map',
        'Confirm reservation and receive QR pass by email',
        'Add literary genres and manage reservations',
    ];

    return (
        <Box sx={{ minHeight: '100dvh', backgroundColor: theme.palette.background.default }}>
            <NavBar role="guest" />

            <Box
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 55%, ${theme.palette.secondary.main} 120%)`,
                    py: { xs: 8, md: 11 },
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: -120,
                        right: -80,
                        width: 340,
                        height: 340,
                        borderRadius: '50%',
                        background: alpha(theme.palette.common.white, 0.12),
                        filter: 'blur(10px)',
                    }}
                />
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography
                                variant="h2"
                                sx={{
                                    color: 'white',
                                    fontWeight: 700,
                                    lineHeight: 1.1,
                                    mb: 2,
                                    animation: 'heroFade 800ms ease-out',
                                    '@keyframes heroFade': {
                                        from: { opacity: 0, transform: 'translateY(16px)' },
                                        to: { opacity: 1, transform: 'translateY(0)' },
                                    },
                                }}
                            >
                                Colombo International Bookfair Reservation Portal
                            </Typography>
                            <Typography sx={{ color: alpha(theme.palette.common.white, 0.9), mb: 3, fontSize: '1.05rem' }}>
                                A modern platform for publishers and vendors to reserve exhibition stalls, confirm bookings, and manage participation.
                            </Typography>

                            <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1} sx={{ mb: 4 }}>
                                <Chip label="Stall Map" sx={{ bgcolor: alpha(theme.palette.common.white, 0.18), color: 'white' }} />
                                <Chip label="3 Stall Limit" sx={{ bgcolor: alpha(theme.palette.common.white, 0.18), color: 'white' }} />
                                <Chip label="QR Entry Pass" sx={{ bgcolor: alpha(theme.palette.common.white, 0.18), color: 'white' }} />
                                <Chip label="Employee Portal" sx={{ bgcolor: alpha(theme.palette.common.white, 0.18), color: 'white' }} />
                            </Stack>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                                <Button
                                    component={RouterLink}
                                    to="/register"
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        borderRadius: '14px',
                                        py: 1.4,
                                        px: 3,
                                        fontWeight: 600,
                                        color: theme.palette.primary.main,
                                        backgroundColor: 'white',
                                        '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.94) },
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
                                        borderRadius: '14px',
                                        py: 1.4,
                                        px: 3,
                                        fontWeight: 600,
                                        borderColor: alpha(theme.palette.common.white, 0.75),
                                        color: 'white',
                                        '&:hover': {
                                            borderColor: 'white',
                                            backgroundColor: alpha(theme.palette.common.white, 0.1),
                                        },
                                    }}
                                >
                                    Sign In
                                </Button>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: '24px',
                                    backgroundColor: alpha(theme.palette.common.white, 0.15),
                                    border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
                                    backdropFilter: 'blur(14px)',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                                        gap: 1,
                                    }}
                                >
                                    {displayTiles.map((img, index) => (
                                        <Box
                                            key={`${img}-${index}`}
                                            sx={{
                                                borderRadius: '12px',
                                                height: { xs: 86, sm: 102 },
                                                backgroundImage: `url(${img})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                opacity: 0.95,
                                                boxShadow: `0 8px 18px ${alpha(theme.palette.common.black, 0.22)}`,
                                                transition: 'all 750ms ease',
                                                '&:hover': {
                                                    transform: 'translateY(-2px) scale(1.02)',
                                                    boxShadow: `0 14px 28px ${alpha(theme.palette.common.black, 0.3)}`,
                                                },
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
                    Reservation Flow
                </Typography>
                <Grid container spacing={2}>
                    {steps.map((step, index) => (
                        <Grid key={step} size={{ xs: 12, md: 6 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2.2,
                                    borderRadius: '16px',
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                                    backgroundColor: alpha(theme.palette.common.white, 0.85),
                                }}
                            >
                                <Typography sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 0.5 }}>
                                    Step {index + 1}
                                </Typography>
                                <Typography color="text.secondary">{step}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <SiteFooter />
        </Box>
    );
};

export default LandingPage;
