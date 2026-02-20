import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

// Components
import AuthLayout from '../../components/layout/AuthLayout';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';

// Utils & API
import { validateEmail } from '../../utils/validation';
import { resetPassword } from '../../api/authApi';

// Assets
const forgotPasswordImage = '/assets/login_pic.jpg'; // Using same image for now

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            setSnackbar({ open: true, message: 'Please enter a valid email.', severity: 'warning' });
            return;
        }

        setLoading(true);
        try {
            const response = await resetPassword(email);
            if (response.success) {
                setSubmitted(true);
                setSnackbar({
                    open: true,
                    message: 'Password reset link sent!',
                    severity: 'success'
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'Failed to send reset link.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    return (
        <AuthLayout
            image={forgotPasswordImage}
            title="Recovery"
            subtitle="Get back into your account."
        >
            <ForgotPasswordForm
                email={email}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                error={error}
                loading={loading}
                submitted={submitted}
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

export default ForgotPassword;
