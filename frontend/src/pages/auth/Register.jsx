import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';

// Components
import AuthLayout from '../../components/layout/AuthLayout';
import SignUpForm from '../../components/auth/SignUpForm';

// Utils & API
import { validateEmail, validatePassword, validateRequired, validatePasswordMatch } from '../../utils/validation';
import { registerUser } from '../../api/authApi';

// Assets
const registerImage = '/assets/login_pic.jpg'; // Using same image for now

const Register = () => {
    const navigate = useNavigate();

    // State
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '' 
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

    const validateForm = () => {
        let tempErrors = {};
        
        const nameError = validateRequired(formData.name, 'Name');
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password, 8);
        const confirmPasswordError = validatePasswordMatch(formData.password, formData.confirmPassword);

        if (nameError) tempErrors.name = nameError;
        if (emailError) tempErrors.email = emailError;
        if (passwordError) tempErrors.password = passwordError;
        if (confirmPasswordError) tempErrors.confirmPassword = confirmPasswordError;

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
            const response = await registerUser(formData);
            if (response.success) {
                setSnackbar({ 
                    open: true, 
                    message: 'Registration successful! Redirecting to login...', 
                    severity: 'success' 
                });
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            }
        } catch (error) {
            setSnackbar({ 
                open: true, 
                message: error.message || 'Registration failed.', 
                severity: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    return (
        <AuthLayout 
            image={registerImage}
            title="Join BookFair"
            subtitle="Start your reading journey today."
        >
            <SignUpForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                errors={errors}
                loading={loading}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                showConfirmPassword={showConfirmPassword}
                toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
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

export default Register;
