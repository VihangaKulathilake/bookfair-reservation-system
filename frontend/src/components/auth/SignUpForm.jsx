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
    useTheme,
    alpha,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Visibility, VisibilityOff, Email, Lock, Person, PersonAdd } from '@mui/icons-material';

const SignUpForm = ({
    formData,
    handleChange,
    handleSubmit,
    errors,
    loading,
    showPassword,
    togglePasswordVisibility,
    showConfirmPassword,
    toggleConfirmPasswordVisibility,
    passwordHelperText,
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
                    Create Account
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Join us and start your reading journey
                </Typography>
            </Box>

            <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Person color="action" />
                        </InputAdornment>
                    ),
                }}
                sx={inputSx}
            />

            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
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
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={passwordHelperText ?? errors.password}
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

            <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Lock color="action" />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle confirm password visibility"
                                onClick={toggleConfirmPasswordVisibility}
                                edge="end"
                            >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    )
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
                    {loading ? <CircularProgress size={24} color="inherit" /> : (
                        <>
                            Create Account <PersonAdd sx={{ ml: 1, fontSize: 20 }} />
                        </>
                    )}
                </Button>
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link
                        component={RouterLink}
                        to="/login"
                        variant="subtitle2"
                        underline="hover"
                        sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}
                    >
                        Sign In
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default SignUpForm;
