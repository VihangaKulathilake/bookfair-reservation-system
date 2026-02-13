import React, { useState, useEffect } from 'react';

import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Link,
    IconButton,
    InputAdornment,
    useTheme,
    useMediaQuery,
    Grid,
    CircularProgress,
    Checkbox,
    FormControlLabel,
    Snackbar,
    Alert,
    alpha
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, PersonAdd, Login as LoginIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// --- Animation Variants ---
const shakeVariant = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
    shake: {
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
    }
};

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

// --- Sub-components ---
const RotatingText = () => {
    const texts = [
        "Your gateway to a world of stories.",
        "Discover your next favorite book.",
        "Join a community of readers."
    ];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % texts.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box sx={{ height: 40, mt: 2, display: 'flex', justifyContent: 'center' }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300, letterSpacing: 0.5 }}>
                        {texts[index]}
                    </Typography>
                </motion.div>
            </AnimatePresence>
        </Box>
    );
};

const Login = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [shouldShake, setShouldShake] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [rememberMe, setRememberMe] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // --- Logic ---
    const validate = (field, value) => {
        let tempErrors = { ...errors };
        if (field === 'email') {
            tempErrors.email = /.+@.+/.test(value) ? "" : "Email is not valid";
            if (!value) tempErrors.email = "Email is required";
        }
        if (field === 'password') {
            tempErrors.password = value.length > 5 ? "" : "Password must be at least 6 characters";
            if (!value) tempErrors.password = "Password is required";
        }
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validate(name, value);
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isEmailValid = validate('email', formData.email);
        const isPasswordValid = validate('password', formData.password);

        if (isEmailValid && isPasswordValid && formData.email && formData.password) {
            setLoading(true);
            setShouldShake(false);
            // Simulate API call
            setTimeout(() => {
                setLoading(false);
                if (formData.email === 'test@test.com' && formData.password === 'password') { // Dummy check
                    setSnackbar({ open: true, message: 'Login successful! Redirecting...', severity: 'success' });
                } else {
                    setSnackbar({ open: true, message: 'Invalid credentials. Try test@test.com / password', severity: 'error' });
                    setShouldShake(true);
                }
            }, 2000);
        } else {
            setShouldShake(true);
            setSnackbar({ open: true, message: 'Please fix the errors below.', severity: 'warning' });
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    // --- Styles ---
    const glassCardStyle = {
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    };

    const inputStyle = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            transition: 'all 0.3s ease',
            '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.1)' },
            '&:hover fieldset': { borderColor: theme.palette.primary.main },
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: '2px',
            },
            '&.Mui-focused': {
                boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }
        },
        '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.primary.main }
    };

    return (
        <Grid container component="main" sx={{ height: '100vh', overflow: 'hidden', backgroundColor: theme.palette.background.default }}>
            {/* Left Side - Visuals */}
            <Grid
                item
                xs={6}
                sm={6}
                md={6}
                sx={{
                    position: 'relative',
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    overflow: 'hidden',
                    width: '50%'
                }}
            >
                {/* Abstract Shapes */}
                <Box sx={{
                    position: 'absolute', top: -100, left: -100, width: 400, height: 400,
                    background: alpha(theme.palette.secondary.main, 0.3), borderRadius: '50%', filter: 'blur(80px)'
                }} />
                <Box sx={{
                    position: 'absolute', bottom: -50, right: -50, width: 300, height: 300,
                    background: alpha(theme.palette.primary.light, 0.3), borderRadius: '50%', filter: 'blur(60px)'
                }} />

                <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, ease: "backOut" }}
                    >
                        <Box sx={{
                            width: 100, height: 100, bgcolor: 'white', borderRadius: '24px', mx: 'auto', mb: 3,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                        }}>
                            <Typography variant="h3">📚</Typography>
                        </Box>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <Typography variant="h2" component="h1" fontWeight="800" gutterBottom sx={{ textShadow: '0px 4px 10px rgba(0,0,0,0.3)' }}>
                            BookFair
                        </Typography>
                    </motion.div>
                    <RotatingText />
                </Container>
            </Grid>

            {/* Right Side - Login Form */}
            <Grid
                item
                xs={6}
                sm={6}
                md={6}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    width: '50%',
                }}
            >
                {/* Background Pattern on Right Side */}
                <Box sx={{
                    position: 'absolute', top: '10%', right: '10%', width: 200, height: 200,
                    background: alpha(theme.palette.primary.main, 0.05), borderRadius: '50%', filter: 'blur(40px)'
                }} />

                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    style={{ width: '100%', maxWidth: '480px', padding: '24px', position: 'relative', zIndex: 10 }}
                >
                    <Paper elevation={0} sx={{ ...glassCardStyle, p: { xs: 3, md: 5 } }}>
                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                            <Typography component="h1" variant="h4" fontWeight="bold" color="text.primary">
                                Welcome Back 👋
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Please enter your details to sign in
                            </Typography>
                        </Box>

                        <motion.div
                            animate={shouldShake ? "shake" : "visible"}
                            variants={shakeVariant}
                        >
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={inputStyle}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock color="action" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={inputStyle}
                                />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 2 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                value="remember"
                                                color="primary"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                sx={{
                                                    '&.Mui-checked': { color: theme.palette.primary.main },
                                                }}
                                            />
                                        }
                                        label={<Typography variant="body2" color="text.secondary">Remember me</Typography>}
                                    />
                                    <Link href="#" variant="body2" color="secondary.main" fontWeight="600" underline="hover">
                                        Forgot Password?
                                    </Link>
                                </Box>

                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        disabled={loading}
                                        sx={{
                                            py: 1.5,
                                            borderRadius: '12px',
                                            fontSize: '1rem',
                                            fontWeight: 'bold',
                                            textTransform: 'none',
                                            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                                            boxShadow: `0 8px 16px 0 ${alpha(theme.palette.primary.main, 0.3)}`,
                                            '&:hover': {
                                                background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                                                boxShadow: `0 12px 20px 0 ${alpha(theme.palette.primary.main, 0.4)}`,
                                            }
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : (
                                            <>
                                                Sign In <LoginIcon sx={{ ml: 1, fontSize: 20 }} />
                                            </>
                                        )}
                                    </Button>
                                </motion.div>

                                <Box sx={{ mt: 3, textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Don't have an account? {' '}
                                        <Link href="#" variant="subtitle2" sx={{ color: theme.palette.secondary.main, fontWeight: 'bold', display: 'inline-flex', alignItems: 'center' }} underline="hover">
                                            Create Account <PersonAdd sx={{ ml: 0.5, fontSize: 16 }} />
                                        </Link>
                                    </Typography>
                                </Box>
                            </Box>
                        </motion.div>
                    </Paper>
                </motion.div>
            </Grid>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 3, boxShadow: 3 }} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default Login;
