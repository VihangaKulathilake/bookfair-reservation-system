import React from 'react';
import { Box, Container, Grid, Paper, Typography, alpha, useTheme, Stepper, Step, StepLabel, StepConnector, stepConnectorClasses } from '@mui/material';
import { Store, QrCode, UserCheck, BookOpen, CheckCircle, Map, CreditCard, Headphones, BarChart } from 'lucide-react';
import LandingNavbar from '../components/layout/LandingNavbar';
import SiteFooter from '../components/layout/SiteFooter';
import HeroSection from '../components/home/HeroSection';
import ScrollAnimation from '../components/common/ScrollAnimation';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const theme = useTheme();

    const steps = [
        { label: 'Register Profile', description: 'Create your vendor or publisher account seamlessly.', icon: <UserCheck size={24} /> },
        { label: 'Select Stalls', description: 'Choose up to 3 prime locations on our interactive map.', icon: <Map size={24} /> },
        { label: 'Confirm & Pay', description: 'Secure your booking instantly with multiple payment options.', icon: <CheckCircle size={24} /> },
        { label: 'Get QR Pass', description: 'Receive your digital entry pass directly to your email.', icon: <QrCode size={24} /> },
    ];

    const ColorlibConnector = (props) => (
        <StepConnector
            {...props}
            sx={{
                [`&.${stepConnectorClasses.alternativeLabel}`]: {
                    top: 22,
                },
                [`& .${stepConnectorClasses.line}`]: {
                    height: 3,
                    border: 0,
                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
                    borderRadius: 1,
                },
            }}
        />
    );

    const FeatureCard = ({ icon, title, description, color }) => (
        <motion.div whileHover={{ y: -10 }}>
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: 4,
                    height: '100%',
                    textAlign: 'center',
                    background: 'rgba(255,255,255,0.6)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: `0 20px 40px ${alpha(color, 0.15)}`,
                        borderColor: alpha(color, 0.3)
                    }
                }}
            >
                <Box
                    sx={{
                        color: color,
                        mb: 2,
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '20px',
                        bgcolor: alpha(color, 0.1)
                    }}
                >
                    {icon}
                </Box>
                <Typography variant="h5" fontWeight={800} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
                    {title}
                </Typography>
                <Typography color="text.secondary" lineHeight={1.6}>
                    {description}
                </Typography>
            </Paper>
        </motion.div>
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
            <LandingNavbar />
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Box sx={{ minHeight: '100dvh', backgroundColor: theme.palette.background.default, overflowX: 'hidden' }}>
                    <HeroSection />

                    {/* How it Works Section */}
                    <Box sx={{ position: 'relative', py: { xs: 8, md: 12 }, overflow: 'hidden' }}>
                        {/* Background Blobs */}
                        <Box sx={{ position: 'absolute', top: '10%', left: '-5%', width: 300, height: 300, background: alpha(theme.palette.primary.main, 0.05), borderRadius: '50%', filter: 'blur(80px)' }} />
                        <Box sx={{ position: 'absolute', bottom: '10%', right: '-5%', width: 400, height: 400, background: alpha(theme.palette.secondary.main, 0.05), borderRadius: '50%', filter: 'blur(100px)' }} />

                        <Container maxWidth="lg" sx={{ position: 'relative' }}>
                            <ScrollAnimation>
                                <Box textAlign="center" mb={8}>
                                    <Typography variant="overline" color="primary" fontWeight={800} letterSpacing={1.5} sx={{ opacity: 0.8 }}>
                                        Simple Process
                                    </Typography>
                                    <Typography variant="h3" fontWeight={900} sx={{ mt: 1, mb: 3, background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.text.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        How It Works
                                    </Typography>
                                    <Typography color="text.secondary" maxWidth={600} mx="auto" fontSize="1.1rem">
                                        Reserve your spot in just a few minutes with our streamlined reservation process designed for efficiency.
                                    </Typography>
                                </Box>
                            </ScrollAnimation>

                            <ScrollAnimation delay={0.2}>
                                <Stepper alternativeLabel connector={<ColorlibConnector />}>
                                    {steps.map((step, index) => (
                                        <Step key={step.label} active={true}>
                                            <StepLabel
                                                StepIconComponent={() => (
                                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                        <Box
                                                            sx={{
                                                                width: 50,
                                                                height: 50,
                                                                borderRadius: '16px', // Modern square-ish
                                                                backgroundColor: theme.palette.background.paper,
                                                                color: theme.palette.primary.main,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                                                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                                                zIndex: 2
                                                            }}
                                                        >
                                                            {step.icon}
                                                        </Box>
                                                    </motion.div>
                                                )}
                                            >
                                                <Typography variant="h6" fontWeight={700} mt={2}>
                                                    {step.label}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 220, mx: 'auto', mt: 1, lineHeight: 1.5 }}>
                                                    {step.description}
                                                </Typography>
                                            </StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </ScrollAnimation>
                        </Container>
                    </Box>

                    {/* Features/Stats Section */}
                    <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02), py: { xs: 8, md: 12 }, position: 'relative' }}>
                        <Container>
                            <Box textAlign="center" mb={6}>
                                <Typography variant="overline" color="secondary" fontWeight={800} letterSpacing={1.2}>
                                    Why Choose Us
                                </Typography>
                                <Typography variant="h3" fontWeight={900} gutterBottom>
                                    Unmatched Features
                                </Typography>
                            </Box>
                            <Grid container spacing={4} justifyContent="center">
                                {[
                                    {
                                        icon: <Store size={32} />,
                                        title: "Over 400 Stalls",
                                        description: "Choose from a variety of stall sizes across multiple exhibition halls, tailored to fit every publisher's needs.",
                                        color: theme.palette.primary.main,
                                        delay: 0.1
                                    },
                                    {
                                        icon: <BookOpen size={32} />,
                                        title: "Millions of Books",
                                        description: "Join the largest gathering of book lovers, publishers, and authors in South Asia.",
                                        color: theme.palette.secondary.main,
                                        delay: 0.2
                                    },
                                    {
                                        icon: <CreditCard size={32} />,
                                        title: "Secure Payments",
                                        description: "Experience hassle-free and secure transactions with multiple payment gateway options.",
                                        color: '#10B981', // Emerald 500
                                        delay: 0.3
                                    }
                                ].map((feature, index) => (
                                    <Grid item key={index} xs={12} sm={6} md={4}>
                                        <ScrollAnimation delay={feature.delay}>
                                            <FeatureCard
                                                icon={feature.icon}
                                                title={feature.title}
                                                description={feature.description}
                                                color={feature.color}
                                            />
                                        </ScrollAnimation>
                                    </Grid>
                                ))}
                            </Grid>
                        </Container>
                    </Box>
                </Box>
            </Box>
            <SiteFooter />
        </Box>
    );
};

export default LandingPage;

