import React from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Link,
    IconButton,
    InputAdornment,
    CircularProgress,
    Checkbox,
    FormControlLabel,
    useTheme,
    alpha,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Visibility, VisibilityOff, Email, Lock, Login as LoginIcon } from '@mui/icons-material';

const SignInForm = ({
    formData,
    handleChange,
    handleSubmit,
    errors,
    loading,
    showPassword,
    togglePasswordVisibility,
    rememberMe,
    setRememberMe
}) => {
    const theme = useTheme();
    const inputSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '14px',
            backgroundColor: alpha(theme.palette.common.white, 0.7),
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease',
            '& fieldset': {
                borderColor: alpha(theme.palette.primary.main, 0.18),
            },
            '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.9),
            },
            '&:hover fieldset': {
                borderColor: alpha(theme.palette.primary.main, 0.45),
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: 2,
            },
        },
    };

    return (
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography component="h1" variant="h4" fontWeight={700} color="text.primary">
                    Welcome Back
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Please enter your details to sign in
                </Typography>
            </Box>

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
                sx={inputSx}
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
                                onClick={togglePasswordVisibility}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
                sx={inputSx}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 3 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            value="remember"
                            color="primary"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                    }
                    label={<Typography variant="body2">Remember me</Typography>}
                />
                <Link
                    component={RouterLink}
                    to="/forgot-password"
                    variant="body2"
                    underline="hover"
                    sx={{ fontWeight: 'bold' }}
                >
                    Forgot Password?
                </Link>
            </Box>

            <Box sx={{ transition: 'transform 0.2s ease', '&:hover': { transform: 'translateY(-1px)' } }}>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                        py: 1.5,
                        borderRadius: '14px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        textTransform: 'none',
                        boxShadow: `0 10px 22px ${alpha(theme.palette.primary.main, 0.35)}`,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        '&:hover': {
                            boxShadow: `0 14px 28px ${alpha(theme.palette.primary.main, 0.42)}`,
                        },
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : (
                        <>
                            Sign In <LoginIcon sx={{ ml: 1, fontSize: 20 }} />
                        </>
                    )}
                </Button>
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link
                        component={RouterLink}
                        to="/register"
                        variant="subtitle2"
                        underline="hover"
                        sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}
                    >
                        Sign Up
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default SignInForm;
