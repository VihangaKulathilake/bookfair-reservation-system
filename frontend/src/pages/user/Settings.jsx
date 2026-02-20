import React from 'react';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Switch,
    Divider,
    Container,
    useTheme
} from '@mui/material';
import {
    Notifications,
    Language,
    DarkMode
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/layout/UserNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import { getStoredAuth } from '../../api/dashboardApi';

const Settings = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const user = getStoredAuth();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
            <UserNavbar userName={user?.businessName || 'User'} onLogout={handleLogout} />

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Container maxWidth="md">
                    <Box sx={{ mx: 'auto' }}>
                        <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 3 }}>
                            Settings
                        </Typography>

                        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>

                                {/*notificationn*/}
                                <ListItem>
                                    <ListItemIcon>
                                        <Notifications color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Email Notifications"
                                        secondary="Receive emails about reservation updates"
                                    />
                                    <Switch edge="end" defaultChecked />
                                </ListItem>

                                <Divider variant="inset" component="li" />

                                {/*Dark mode*/}
                                <ListItem>
                                    <ListItemIcon>
                                        <DarkMode color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Dark Mode"
                                        secondary="Switch between light and dark themes"
                                    />
                                    <Switch edge="end" />
                                </ListItem>

                                <Divider variant="inset" component="li" />

                                {/*language select */}
                                <ListItem button>
                                    <ListItemIcon>
                                        <Language color="primary" />
                                    </ListItemIcon>

                                    <ListItemText
                                        primary="Language"
                                        secondary="English (US)"
                                    />
                                </ListItem>

                            </List>
                        </Paper>
                    </Box>
                </Container>
            </Box>
            <SiteFooter />
        </Box>
    );
};

export default Settings;
