import React from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Link,
    InputAdornment,
    CircularProgress,
    useTheme,
    alpha
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Email, ArrowBack, CheckCircleOutline } from '@mui/icons-material';

const ForgotPasswordForm = ({
    email,
    handleChange,
    handleSubmit,
    error,
    loading,
    submitted
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

    if (submitted) {
        return (
            <Box sx={{ textAlign: 'center', py: 4, width: '100%' }}>
                <Box
                    sx={{
                        animation: 'popIn 360ms ease-out',
                        '@keyframes popIn': {
                            from: { opacity: 0, transform: 'scale(0.85)' },
                            to: { opacity: 1, transform: 'scale(1)' },
                        },
                    }}
                >
                    <CheckCircleOutline sx={{ mb: 2, fontSize: 56, color: theme.palette.success.main }} />
                </Box>
                <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
                    Check Your Email
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    We've sent a password reset link to <strong>{email}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Please check your inbox and click the link to reset your password.
                </Typography>
                <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    sx={{
                        borderRadius: '14px',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        borderWidth: '2px',
                        '&:hover': {
                            borderWidth: '2px',
                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        }
                    }}
                >
                    <ArrowBack sx={{ mr: 1, fontSize: 18 }} />
                    Back to Login
                </Button>
            </Box>
        );
    }

    return (
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography component="h1" variant="h4" fontWeight={700} color="text.primary">
                    Forgot Password
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Enter your email to receive a reset link
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
                value={email}
                onChange={handleChange}
                error={!!error}
                helperText={error}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Email color="action" />
                        </InputAdornment>
                    ),
                }}
                sx={inputSx}
            />

            <Box sx={{ transition: 'transform 0.2s ease', '&:hover': { transform: 'translateY(-1px)' } }}>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                        mt: 3,
                        py: 1.5,
                        borderRadius: '14px',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        fontSize: '1rem',
                        boxShadow: `0 10px 22px ${alpha(theme.palette.primary.main, 0.35)}`,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        '&:hover': {
                            boxShadow: `0 14px 28px ${alpha(theme.palette.primary.main, 0.42)}`,
                        },
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
                </Button>
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Link
                    component={RouterLink}
                    to="/login"
                    variant="subtitle2"
                    underline="hover"
                    sx={{
                        color: theme.palette.secondary.main,
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5
                    }}
                >
                    <ArrowBack sx={{ fontSize: 16 }} />
                    Back to Login
                </Link>
            </Box>
        </Box>
    );
};

export default ForgotPasswordForm;
