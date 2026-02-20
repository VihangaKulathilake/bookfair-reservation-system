import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';
import UserNavbar from './UserNavbar';

const UserLayout = () => {
    const theme = useTheme();

    // Mock logout function - replace with actual auth logic later
    const handleLogout = () => {
        console.log('User logging out...');
        // Add logout logic here
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', bgcolor: theme.palette.background.default }}>
            <UserNavbar
                userName="User Name" // Replace with real user data
                onLogout={handleLogout}
            />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default UserLayout;
