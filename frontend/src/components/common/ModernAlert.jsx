import React from 'react';
import { Box, Typography, Paper, IconButton, alpha, useTheme, Zoom } from '@mui/material';
import { WarningAmber, Close, GppMaybe, InfoOutlined, ErrorOutline } from '@mui/icons-material';

/**
 * A premium, modern warning card for showing business rule violations or alerts.
 * @param {string} severity - 'warning' | 'error' | 'info'
 * @param {string} title - The header text
 * @param {string} message - The main content text
 * @param {boolean} open - Control visibility
 * @param {function} onClose - Function to call on close
 */
const ModernAlert = ({ severity = 'warning', title, message, open, onClose }) => {
    const theme = useTheme();

    if (!open) return null;

    const getColors = () => {
        switch (severity) {
            case 'error':
                return {
                    main: theme.palette.error.main,
                    light: alpha(theme.palette.error.main, 0.05),
                    icon: <ErrorOutline fontSize="large" />,
                    accent: theme.palette.error.dark
                };
            case 'info':
                return {
                    main: theme.palette.info.main,
                    light: alpha(theme.palette.info.main, 0.05),
                    icon: <InfoOutlined fontSize="large" />,
                    accent: theme.palette.info.dark
                };
            default: // warning
                return {
                    main: theme.palette.warning.main,
                    light: alpha(theme.palette.warning.main, 0.05),
                    icon: <WarningAmber fontSize="large" />,
                    accent: theme.palette.warning.dark
                };
        }
    };

    const colors = getColors();

    return (
        <Zoom in={open}>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: alpha(colors.main, 0.2),
                    bgcolor: 'white',
                    display: 'flex',
                    alignItems: 'flex-start',
                    position: 'relative',
                    overflow: 'hidden',
                    mb: 3,
                    boxShadow: `0 10px 40px ${alpha(colors.main, 0.08)}`,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '6px',
                        bgcolor: colors.main
                    }
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        bgcolor: colors.light,
                        color: colors.main,
                        mr: 2.5,
                        flexShrink: 0
                    }}
                >
                    {colors.icon}
                </Box>

                <Box sx={{ flexGrow: 1, pr: 4 }}>
                    <Typography variant="h6" fontWeight={800} color="text.primary" sx={{ mb: 0.5, lineHeight: 1.2 }}>
                        {title || (severity === 'error' ? 'Critical Error' : 'Attention Required')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ opacity: 0.9 }}>
                        {message}
                    </Typography>
                </Box>

                {onClose && (
                    <IconButton
                        onClick={onClose}
                        size="small"
                        sx={{
                            position: 'absolute',
                            right: 12,
                            top: 12,
                            color: 'text.disabled',
                            '&:hover': { color: 'text.primary', bgcolor: alpha(theme.palette.divider, 0.1) }
                        }}
                    >
                        <Close fontSize="small" />
                    </IconButton>
                )}
            </Paper>
        </Zoom>
    );
};

export default ModernAlert;
