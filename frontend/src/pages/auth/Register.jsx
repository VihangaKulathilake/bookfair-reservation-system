import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';

// Components
import AuthLayout from '../../components/layout/AuthLayout';
import SignUpForm from '../../components/auth/SignUpForm';

// Utils & API
import { validateEmail, validatePassword, validatePasswordMatch, validateName, validatePhoneNumber, passwordRulesText } from '../../utils/validation';
import { registerUser } from '../../api/authApi';

// Assets
const registerImage = '/assets/login_pic.jpg'; // Using same image for now

const Register = () => {
    const navigate = useNavigate();
    const PASSWORD_MIN_LENGTH = 8;

    // State
    const [formData, setFormData] = useState({
        businessName: '',
        contactPerson: '',
        address: '',
        email: '',
        password: '',
        confirmPassword: '',
        contactNumber: ''
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

        const nameError = validateName(formData.businessName);
        const contactPersonError = validateName(formData.contactPerson);
        const addressError = formData.address.trim() ? '' : 'Address is required';
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password, PASSWORD_MIN_LENGTH);
        const confirmPasswordError = validatePasswordMatch(formData.password, formData.confirmPassword);
        const phoneError = validatePhoneNumber(formData.contactNumber);

        if (nameError) tempErrors.businessName = nameError;
        if (contactPersonError) tempErrors.contactPerson = contactPersonError;
        if (addressError) tempErrors.address = addressError;
        if (emailError) tempErrors.email = emailError;
        if (passwordError) tempErrors.password = passwordError;
        if (confirmPasswordError) tempErrors.confirmPassword = confirmPasswordError;
        if (phoneError) tempErrors.contactNumber = phoneError;

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
            // Exclude confirmPassword from the API request
            const { confirmPassword, ...requestData } = formData;
            const response = await registerUser(requestData);
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

export default Register;
