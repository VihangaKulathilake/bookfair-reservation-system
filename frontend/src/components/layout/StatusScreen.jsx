import React from 'react';
import { Box, Typography, Button, Paper, Grow } from '@mui/material';
import { CheckCircleOutline, ErrorOutline, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StatusScreen = ({ type = 'success', title, message, actionLabel, onAction }) => {
    const navigate = useNavigate();
    const isSuccess = type === 'success';

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80vh',
                p: 3,
            }}
        >
            <Grow in={true} timeout={800}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 6,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        maxWidth: 500,
                        width: '100%',
                        borderRadius: 4,
                    }}
                    
                >

                    {isSuccess ? (
                        <CheckCircleOutline sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                    ) : (
                        <ErrorOutline sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                    )}

                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: isSuccess ? 'success.main' : 'error.main' }}>
                        {title}
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        {message}
                    </Typography>

                    <Button
                        variant="contained"
                        color={isSuccess ? 'success' : 'error'}
                        size="large"
                        onClick={onAction || (() => navigate('/'))}
                        startIcon={!actionLabel && <Home />}
                        fullWidth
                        sx={{ py: 1.5, borderRadius: 2 }}
                    >

                        {actionLabel || 'Go to Home'}
                    </Button>
                </Paper>
            </Grow>
        </Box>
    );
};

export default StatusScreen;
