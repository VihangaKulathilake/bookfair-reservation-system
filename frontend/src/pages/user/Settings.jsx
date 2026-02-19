
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
    Divider
} from '@mui/material';
import {
    Notifications,
    Lock,
    Language,
    DarkMode
} from '@mui/icons-material';

const Settings = () => {
    return (

        <Box sx={{ maxWidth: 800, mx: 'auto' }}>

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
    );
};

export default Settings;
