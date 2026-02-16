import { alpha } from '@mui/material';

/**
 * Auth Form Styles
 * Shared styles for authentication forms
 */

export const getInputStyle = (theme) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        transition: 'all 0.3s ease',
        '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.1)' },
        '&:hover fieldset': { borderColor: theme.palette.primary.main },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: '2px',
        },
        '&.Mui-focused': {
            boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }
    },
    '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.primary.main }
});

export const getButtonStyle = (theme) => ({
    py: 1.5,
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 'bold',
    textTransform: 'none',
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
    boxShadow: `0 8px 16px 0 ${alpha(theme.palette.primary.main, 0.3)}`,
    '&:hover': {
        background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
        boxShadow: `0 12px 20px 0 ${alpha(theme.palette.primary.main, 0.4)}`,
    }
});
