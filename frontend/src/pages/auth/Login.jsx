import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';

// Components
import AuthLayout from '../../components/layout/AuthLayout';
import SignInForm from '../../components/auth/SignInForm';

// Utils & API
import { validateEmail, validatePassword, passwordRulesText } from '../../utils/validation';
import { loginUser } from '../../api/authApi';

// Assets
const loginImage = '/assets/login_pic.jpg'; // Ensure this matches public asset path

const Login = () => {
    const navigate = useNavigate();
    const PASSWORD_MIN_LENGTH = 8;
    
    // State
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Clear error when user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const validateForm = () => {
        let tempErrors = {};
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password, PASSWORD_MIN_LENGTH);

        if (emailError) tempErrors.email = emailError;
        if (passwordError) tempErrors.password = passwordError;

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setSnackbar({ open: true, message: 'Please fix the errors below.', severity: 'warning' });
            return;
        }

        setLoading(true);
        try {
            const response = await loginUser(formData.email, formData.password);
            if (response.success) {
                setSnackbar({ open: true, message: 'Login successful! Redirecting...', severity: 'success' });
                const destination = response.user?.role === 'EMPLOYEE' ? '/admin' : '/vendor';
                setTimeout(() => {
                    navigate(destination);
                }, 1500);
            }
        } catch (error) {
            setSnackbar({ 
                open: true, 
                message: error.message || 'Login failed. Please try again.', 
                severity: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    return (
        <AuthLayout 
            image={loginImage}
            title="BookFair"
            subtitle="Discover your next favorite book."
        >
            <SignInForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                errors={errors}
                loading={loading}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                rememberMe={rememberMe}
                setRememberMe={setRememberMe}
                passwordHelperText={errors.password || passwordRulesText(PASSWORD_MIN_LENGTH)}
            />
            
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </AuthLayout>
    );
};

export default Login;
