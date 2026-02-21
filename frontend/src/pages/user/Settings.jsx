import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Switch,
    Container,
    Avatar,
    IconButton,
    useTheme,
    alpha,
    Card,
    CardContent,
    Button,
    Divider,
    Tabs,
    Tab,
    useMediaQuery
} from '@mui/material';
import {
    Notifications,
    Language,
    DarkMode,
    Business,
    Logout,
    Shield,
    HelpOutline,
    KeyboardArrowRight,
    AccountCircle,
    Palette,
    Security
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/layout/UserNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { logoutUser } from '../../api/authApi';
import { getStoredAuth } from '../../api/dashboardApi';

const SettingsCard = ({ icon: Icon, title, description, action, delay = 0 }) => {
    const theme = useTheme();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
        >
            <Card sx={{
                background: alpha(theme.palette.background.paper, 0.6),
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                mb: 2,
                '&:hover': {
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
                    borderColor: alpha(theme.palette.primary.main, 0.2)
                }
            }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', p: '20px !important' }}>
                    <Box sx={{
                        p: 1.2,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        mr: 2,
                        display: 'flex'
                    }}>
                        <Icon fontSize="small" />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>{title}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>{description}</Typography>
                    </Box>
                    <Box sx={{ ml: 2 }}>
                        {action}
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const Settings = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const user = getStoredAuth();
    const [activeTab, setActiveTab] = useState(0);
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const tabStyles = {
        minHeight: 48,
        borderRadius: 2,
        mb: 1,
        justifyContent: 'flex-start',
        textTransform: 'none',
        fontWeight: 600,
        '&.Mui-selected': {
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
        },
        '& .MuiSvgIcon-root': {
            mr: 1.5,
            fontSize: 20
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            bgcolor: alpha(theme.palette.background.default, 0.98),
            backgroundImage: `radial-gradient(circle at 2% 2%, ${alpha(theme.palette.primary.main, 0.03)} 0%, transparent 40%), 
                             radial-gradient(circle at 98% 98%, ${alpha(theme.palette.secondary.main, 0.03)} 0%, transparent 40%)`
        }}>
            <UserNavbar userName={user?.businessName || 'User'} onLogout={handleLogout} />

            <Container maxWidth="lg" sx={{ flexGrow: 1, py: { xs: 4, md: 8 } }}>
                <Grid container spacing={4}>
                    {/* Sidebar / Top Tabs */}
                    <Grid item xs={12} md={3.5}>
                        <Box sx={{ position: { md: 'sticky' }, top: 24 }}>
                            {/* Profile Brief */}
                            <Paper sx={{
                                p: 3,
                                borderRadius: 5,
                                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.background.paper, 0.8)})`,
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                mb: 3,
                                textAlign: 'center'
                            }}>
                                <Avatar sx={{
                                    width: 64,
                                    height: 64,
                                    mx: 'auto',
                                    mb: 1.5,
                                    bgcolor: theme.palette.primary.main,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}>
                                    {user?.businessName?.charAt(0) || 'U'}
                                </Avatar>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>{user?.businessName || 'Your Business'}</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                                    {user?.email || 'user@example.com'}
                                </Typography>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<Logout />}
                                    onClick={handleLogout}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontSize: '0.75rem',
                                        borderColor: alpha(theme.palette.error.main, 0.3),
                                        color: theme.palette.error.main,
                                        '&:hover': {
                                            borderColor: theme.palette.error.main,
                                            bgcolor: alpha(theme.palette.error.main, 0.05)
                                        }
                                    }}
                                >
                                    Log Out
                                </Button>
                            </Paper>

                            <Tabs
                                orientation={isMobile ? "horizontal" : "vertical"}
                                variant="scrollable"
                                value={activeTab}
                                onChange={handleTabChange}
                                sx={{
                                    borderRight: isMobile ? 0 : 0,
                                    '& .MuiTabs-indicator': { display: 'none' }
                                }}
                            >
                                <Tab icon={<AccountCircle />} label="Account" {...tabStyles} iconPosition="start" />
                                <Tab icon={<Palette />} label="Preferences" {...tabStyles} iconPosition="start" />
                                <Tab icon={<Security />} label="Security" {...tabStyles} iconPosition="start" />
                                <Tab icon={<HelpOutline />} label="Support" {...tabStyles} iconPosition="start" />
                            </Tabs>
                        </Box>
                    </Grid>

                    {/* Content Area */}
                    <Grid item xs={12} md={8.5}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 0 && (
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Account Settings</Typography>
                                        <SettingsCard
                                            icon={Business}
                                            title="Business Information"
                                            description="Update your business name, address and billing details"
                                            action={<IconButton size="small"><KeyboardArrowRight /></IconButton>}
                                        />
                                        <SettingsCard
                                            icon={Language}
                                            title="Region & Language"
                                            description="Set your preferred language and regional format"
                                            action={<Typography variant="body2" sx={{ fontWeight: 600 }}>English (US)</Typography>}
                                        />
                                    </Box>
                                )}

                                {activeTab === 1 && (
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>System Preferences</Typography>
                                        <SettingsCard
                                            icon={Notifications}
                                            title="Push Notifications"
                                            description="Receive real-time updates about your reservations"
                                            action={<Switch size="small" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />}
                                        />
                                        <SettingsCard
                                            icon={DarkMode}
                                            title="Dark Mode"
                                            description="Customize your interface appearance"
                                            action={<Switch size="small" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />}
                                        />
                                    </Box>
                                )}

                                {activeTab === 2 && (
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Security & Privacy</Typography>
                                        <SettingsCard
                                            icon={Shield}
                                            title="Password"
                                            description="Change your account password regularly"
                                            action={<Button size="small" variant="text">Update</Button>}
                                        />
                                        <SettingsCard
                                            icon={Security}
                                            title="Two-Factor Authentication"
                                            description="Add an extra layer of security to your account"
                                            action={<Switch size="small" />}
                                        />
                                    </Box>
                                )}

                                {activeTab === 3 && (
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Help & Support</Typography>
                                        <SettingsCard
                                            icon={HelpOutline}
                                            title="Help Center"
                                            description="Browse documentation and guides"
                                            action={<IconButton size="small"><KeyboardArrowRight /></IconButton>}
                                        />
                                        <SettingsCard
                                            icon={Business}
                                            title="Contact Us"
                                            description="Get in touch with our support team"
                                            action={<Button size="small" variant="outlined" sx={{ borderRadius: 2 }}>Chat</Button>}
                                        />
                                    </Box>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </Grid>
                </Grid>
            </Container>

            <SiteFooter />
        </Box>
    );
};

export default Settings;
