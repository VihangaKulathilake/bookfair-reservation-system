import React from 'react';
import {
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
import { Email, Facebook, Instagram, LocationOn, Twitter } from '@mui/icons-material';

const SiteFooter = () => {
    const theme = useTheme();
    const year = new Date().getFullYear();

    return (
        <Paper
            component="footer"
            square
            elevation={0}
            sx={{
                mt: { xs: 6, md: 10 },
                pt: 6,
                pb: 5,
                background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.04)} 0%, ${alpha(theme.palette.secondary.main, 0.09)} 100%)`,
                borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={5}>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Stack spacing={1.2}>
                            <Typography variant="h5" fontWeight={800} color="primary.main">
                                BookFair Reservation
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, lineHeight: 1.8 }}>
                                Official reservation platform for Colombo International Bookfair, built for publishers and vendors to manage stalls with speed, clarity, and confidence.
                            </Typography>
                            <Button
                                component={RouterLink}
                                to="/register"
                                variant="contained"
                                size="medium"
                                sx={{
                                    mt: 1.2,
                                    width: 'fit-content',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    borderRadius: 2,
                                    px: 3,
                                }}
                            >
                                Start Registration
                            </Button>
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.2 }}>
                            Navigation
                        </Typography>
                        <Stack spacing={0.9}>
                            <Link component={RouterLink} to="/" underline="hover" color="text.secondary">Home</Link>
                            <Link component={RouterLink} to="/register" underline="hover" color="text.secondary">Register</Link>
                            <Link component={RouterLink} to="/login" underline="hover" color="text.secondary">Sign In</Link>
                            
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.2 }}>
                            Contact
                        </Typography>
                        <Stack spacing={1.1}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Email fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">support@bookfair.lk</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <LocationOn fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">Colombo, Sri Lanka</Typography>
                            </Stack>
                            <Stack direction="row" spacing={0.8}>
                                <IconButton size="small" aria-label="Facebook" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
                                    <Facebook fontSize="small" />
                                </IconButton>
                                <IconButton size="small" aria-label="Instagram" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
                                    <Instagram fontSize="small" />
                                </IconButton>
                                <IconButton size="small" aria-label="Twitter" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
                                    <Twitter fontSize="small" />
                                </IconButton>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, borderColor: alpha(theme.palette.primary.main, 0.12) }} />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        © {year} BookFair Reservation System. All rights reserved.
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Link component={RouterLink} to="/" underline="hover" color="text.secondary">
                            Terms
                        </Link>
                        <Link component={RouterLink} to="/" underline="hover" color="text.secondary">
                            Privacy
                        </Link>
                    </Stack>
                </Stack>
            </Container>
        </Paper>
    );
};

export default SiteFooter;
