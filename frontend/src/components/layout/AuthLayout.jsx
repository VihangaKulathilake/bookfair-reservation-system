import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Typography, useTheme, alpha, Chip, Stack } from '@mui/material';

const AuthLayout = ({ children, image, title, subtitle }) => {
    const theme = useTheme();
    const galleryImages = useMemo(
        () => [
            image,
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1600&q=80',
        ].filter(Boolean),
        [image]
    );
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
        }, 4500);

        return () => clearInterval(timer);
    }, [galleryImages.length]);

    return (
        <Grid container component="main" sx={{ minHeight: '100dvh', width: '100%', overflow: 'hidden', m: 0 }}>
            <Grid
                size={{ xs: 12, sm: 6, md: 6 }}
                sx={{
                    position: 'relative',
                    backgroundImage: `url(${galleryImages[activeImageIndex]})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: { xs: 'none', sm: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100dvh',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}cc 0%, ${theme.palette.secondary.main}aa 100%)`,
                        zIndex: 1,
                    },
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '-15%',
                        right: '-10%',
                        width: 320,
                        height: 320,
                        borderRadius: '50%',
                        background: alpha(theme.palette.secondary.main, 0.25),
                        filter: 'blur(60px)',
                        zIndex: 1,
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '-20%',
                        left: '-10%',
                        width: 360,
                        height: 360,
                        borderRadius: '50%',
                        background: alpha(theme.palette.primary.light, 0.35),
                        filter: 'blur(70px)',
                        zIndex: 1,
                    }}
                />
                <Box sx={{ position: 'relative', zIndex: 2, color: 'white', textAlign: 'center', px: 4 }}>
                    <Box
                        sx={{
                            animation: 'fadeUp 700ms ease-out',
                            '@keyframes fadeUp': {
                                from: { opacity: 0, transform: 'translateY(24px)' },
                                to: { opacity: 1, transform: 'translateY(0)' },
                            },
                        }}
                    >
                        {title && (
                            <Typography
                                variant="h2"
                                component="h1"
                                fontWeight="bold"
                                sx={{
                                    textShadow: '0px 4px 20px rgba(0,0,0,0.5)',
                                    mb: 2,
                                }}
                            >
                                {title}
                            </Typography>
                        )}
                        {subtitle && (
                            <Typography
                                variant="h5"
                                sx={{
                                    textShadow: '0px 2px 10px rgba(0,0,0,0.5)',
                                    fontWeight: 300,
                                    maxWidth: '500px',
                                    mx: 'auto',
                                    mb: 3,
                                }}
                            >
                                {subtitle}
                            </Typography>
                        )}

                        <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
                            <Chip
                                label="Small / Medium / Large Stalls"
                                size="small"
                                sx={{
                                    color: 'white',
                                    borderColor: alpha(theme.palette.common.white, 0.45),
                                    backgroundColor: alpha(theme.palette.common.white, 0.12),
                                    backdropFilter: 'blur(6px)',
                                }}
                                variant="outlined"
                            />
                            <Chip
                                label="Max 3 Stalls per Business"
                                size="small"
                                sx={{
                                    color: 'white',
                                    borderColor: alpha(theme.palette.common.white, 0.45),
                                    backgroundColor: alpha(theme.palette.common.white, 0.12),
                                    backdropFilter: 'blur(6px)',
                                }}
                                variant="outlined"
                            />
                            <Chip
                                label="Email + QR Pass Confirmation"
                                size="small"
                                sx={{
                                    color: 'white',
                                    borderColor: alpha(theme.palette.common.white, 0.45),
                                    backgroundColor: alpha(theme.palette.common.white, 0.12),
                                    backdropFilter: 'blur(6px)',
                                }}
                                variant="outlined"
                            />
                        </Stack>

                        <Box
                            sx={{
                                mt: 4,
                                p: 2,
                                borderRadius: '18px',
                                backgroundColor: alpha(theme.palette.common.white, 0.45),
                                border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                                textAlign: 'left',
                                maxWidth: 520,
                                mx: 'auto',
                            }}
                        >
                            <Typography sx={{ color: alpha(theme.palette.common.black, 0.6), fontSize: '0.95rem', fontWeight: 600, mb: 1.2 }}>
                                Reservation management built for Colombo International Bookfair
                            </Typography>
                            <Typography sx={{ color: alpha(theme.palette.common.black, 0.6), fontSize: '0.86rem', lineHeight: 1.6, opacity: 0.95 }}>
                                Register publishers and vendors, choose available stalls on a venue map, confirm reservations, and streamline access with QR pass delivery.
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 26,
                        left: 28,
                        right: 28,
                        zIndex: 3,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                        gap: 1.2,
                    }}
                >
                    {galleryImages.slice(0, 4).map((tileImage, index) => {
                        const active = index === activeImageIndex;
                        return (
                            <Box
                                key={tileImage}
                                onClick={() => setActiveImageIndex(index)}
                                sx={{
                                    cursor: 'pointer',
                                    height: 72,
                                    borderRadius: '12px',
                                    backgroundImage: `url(${tileImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    border: active
                                        ? `2px solid ${alpha(theme.palette.common.white, 0.95)}`
                                        : `1px solid ${alpha(theme.palette.common.white, 0.35)}`,
                                    boxShadow: active
                                        ? `0 10px 22px ${alpha(theme.palette.common.black, 0.35)}`
                                        : 'none',
                                    transform: active ? 'translateY(-2px)' : 'none',
                                    transition: 'all 220ms ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        borderColor: alpha(theme.palette.common.white, 0.85),
                                    },
                                }}
                            />
                        );
                    })}
                </Box>
            </Grid>

            <Grid
                size={{ xs: 12, sm: 6, md: 6 }}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100dvh',
                    background: `radial-gradient(circle at 30% 20%, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 45%), ${theme.palette.background.default}`,
                }}
            >
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        maxWidth: '450px',
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            animation: 'fadeRight 650ms ease-out',
                            '@keyframes fadeRight': {
                                from: { opacity: 0, transform: 'translateX(28px)' },
                                to: { opacity: 1, transform: 'translateX(0)' },
                            },
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                p: { xs: 3, md: 4 },
                                borderRadius: '24px',
                                border: `1px solid ${alpha(theme.palette.common.white, 0.55)}`,
                                backgroundColor: alpha(theme.palette.common.white, 0.62),
                                backdropFilter: 'blur(18px)',
                                boxShadow: `0 20px 45px ${alpha(theme.palette.primary.main, 0.16)}`,
                            }}
                        >
                            {children}
                        </Box>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

AuthLayout.propTypes = {
    children: PropTypes.node.isRequired,
    image: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
};

AuthLayout.defaultProps = {
    image: '/assets/login_pic.jpg',
    title: 'Welcome',
    subtitle: 'Please sign in to continue',
};

export default AuthLayout;
