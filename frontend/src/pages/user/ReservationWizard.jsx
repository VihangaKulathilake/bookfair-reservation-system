import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, Paper, Container, useTheme } from '@mui/material';
import UserNavbar from '../../components/layout/UserNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import StallSelection from './StallSelection';
import CompanyDetailsForm from './CompanyDetailsForm';
import BookingConfirmation from './BookingConfirmation';
import { logoutUser } from '../../api/authApi';
import { getStoredAuth, getVendorById } from '../../api/dashboardApi';

import { useLocation, useNavigate } from 'react-router-dom';

// Steps definition
const steps = ['Select Stalls', 'Company Details', 'Confirmation'];

const ReservationWizard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(location.state?.initialStep || 0);
    const [selectedStalls, setSelectedStalls] = useState(location.state?.selectedStalls || []);
    const [companyDetails, setCompanyDetails] = useState({});
    const [bookingResult, setBookingResult] = useState(null);

    const [fullUser, setFullUser] = useState(null);

    const user = getStoredAuth();

    // Fetch full user details on mount if we have a userId
    React.useEffect(() => {
        if (user?.userId) {
            getVendorById(user.userId)
                .then(data => setFullUser(data))
                .catch(err => console.error("Failed to fetch user:", err));
        }
    }, []);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
        setSelectedStalls([]);
        setCompanyDetails({});
        setBookingResult(null);
    };

    const getStepContent = (step) => {
        // Use fetched user if available, otherwise localStorage user, otherwise null
        let currentUser = fullUser || user || null;

        // If user is null, try getting from localStorage (redundant if getStoredAuth works, but safe)
        if (!currentUser) {
            const userStr = localStorage.getItem('user');
            currentUser = userStr ? JSON.parse(userStr) : null;
        }

        // Dummy fallback if needed for testing without login (though protected route should prevent this)
        if (!currentUser || !currentUser.id) {
            // Only use dummy if absolutely necessary
            // console.warn("No user found, using fallback");  // Commented out to reduce noise
            currentUser = {
                id: 3, // potential issue if backend expects valid ID
                businessName: '',
                email: '',
                contactNumber: ''
            };
        }

        switch (step) {
            case 0:
                return (
                    <StallSelection
                        onStallsSelected={(stalls) => {
                            setSelectedStalls(stalls);
                        }}
                        initialSelected={selectedStalls}
                        isStandalone={false}
                    />
                );
            case 1:
                return (
                    <CompanyDetailsForm
                        onDetailsSubmit={(details) => {
                            setCompanyDetails(details);
                            handleNext();
                        }}
                        initialDetails={currentUser}
                    />
                );
            case 2:
                return (
                    <BookingConfirmation
                        bookingDetails={{ stalls: selectedStalls, company: currentUser }} // Pass user info
                    />
                );
            default:
                return 'Unknown step';
        }
    };

    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
            <UserNavbar userName={user?.businessName || 'User'} onLogout={handleLogout} />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Stall Reservation
                        </Typography>
                        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        <Box sx={{ mt: 2, mb: 2 }}>
                            {/* Navigation Buttons (Top) - Only for Step 0 */}
                            {activeStep === 0 && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 0, pb: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        disabled={selectedStalls.length === 0}
                                        size="large"
                                    >
                                        Next Step &gt;
                                    </Button>
                                </Box>
                            )}

                            {activeStep === steps.length ? (
                                <React.Fragment>
                                    <Typography sx={{ mt: 2, mb: 1 }}>
                                        All steps completed - you&apos;re finished
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                        <Box sx={{ flex: '1 1 auto' }} />
                                        <Button onClick={handleReset}>Reset</Button>
                                    </Box>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    {getStepContent(activeStep)}

                                    {/* Bottom Navigation (Back Button) */}
                                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, justifyContent: 'flex-start', mt: 3 }}>
                                        <Button
                                            color="inherit"
                                            disabled={activeStep === 0}
                                            onClick={handleBack}
                                            sx={{ mr: 1 }}
                                        >
                                            Back
                                        </Button>
                                    </Box>
                                </React.Fragment>
                            )}
                        </Box>
                    </Paper>
                </Container >
            </Box >
            <SiteFooter />
        </Box >
    );
};

export default ReservationWizard;
