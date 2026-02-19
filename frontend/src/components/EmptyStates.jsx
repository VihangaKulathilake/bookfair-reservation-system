import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const EmptyState = ({ title, description, actionLabel, onAction }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                p: 4,
                textAlign: 'center',
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 6,
                    backgroundColor: 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box
                    component="img"
                    src="https://illustrations.popsy.co/amber/surr-no-data.svg" 
                    alt="No data"
                    sx={{ width: 200, height: 200, mb: 4, opacity: 0.8 }}
                />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
                    {description}
                </Typography>
                {actionLabel && (

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={onAction}
                        size="large"
                        sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                    >
                        {actionLabel}
                    </Button>
                    
                )}
            </Paper>
        </Box>
    );
};

export default EmptyState;
