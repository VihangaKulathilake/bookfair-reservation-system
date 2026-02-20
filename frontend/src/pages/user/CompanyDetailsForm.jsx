import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Stack, Alert } from '@mui/material';

const CompanyDetailsForm = ({ onDetailsSubmit, initialDetails }) => {
    // Map initialDetails (User object) to form fields
    const [details, setDetails] = useState({
        companyName: initialDetails.businessName || '',
        email: initialDetails.email || '',
        phone: initialDetails.contactNumber || '',
    });

    React.useEffect(() => {
        setDetails({
            companyName: initialDetails.businessName || '',
            email: initialDetails.email || '',
            phone: initialDetails.contactNumber || '',
        });
    }, [initialDetails]);

    // We can auto-submit if we want to skip this step entirely, 
    // but for now let's show it as a "Review" step.

    const handleSubmit = () => {
        onDetailsSubmit(details);
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                Review Company Details
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
                These details will be associated with your reservation.
            </Typography>

            <Stack spacing={3}>
                <TextField
                    label="Company / Business Name"
                    name="companyName"
                    value={details.companyName}
                    fullWidth
                    InputProps={{
                        readOnly: true,
                    }}
                    helperText="From your registered profile"
                />
                <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={details.email}
                    fullWidth
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <TextField
                    label="Phone Number"
                    name="phone"
                    value={details.phone}
                    fullWidth
                    InputProps={{
                        readOnly: true,
                    }}
                />

                <Button variant="contained" onClick={handleSubmit} size="large">
                    Confirm & Continue
                </Button>
            </Stack>
        </Box>
    );
};

export default CompanyDetailsForm;
