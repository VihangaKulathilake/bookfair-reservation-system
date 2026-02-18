//UserProfile Page
import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    Button,
    Avatar,
    Divider
} from '@mui/material';
import { Save } from '@mui/icons-material';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        companyName: 'Best Books Inc.',
        contactPerson: 'John Doe',
        email: 'john@bestbooks.com',
        phone: '+94 77 123 4567',
        address: '123, Literature Road, Colombo 07',
        description: 'Leading publisher of educational details.'
    });

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 3 }}>
                Company Profile
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%', borderRadius: 3 }}>
                        <Avatar
                            alt={profile.companyName}
                            src="/static/images/avatar/1.jpg"
                            sx={{ width: 120, height: 120, mx: 'auto', mb: 2, bgcolor: 'secondary.main' }}
                        >
                            {profile.companyName.charAt(0)}
                        </Avatar>
                        <Typography variant="h6" gutterBottom>{profile.companyName}</Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>{profile.email}</Typography>

                        <Button variant="outlined" sx={{ mt: 2 }} fullWidth>
                            Change Logo
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Details</Typography>
                            <Button onClick={() => setIsEditing(!isEditing)}>
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </Button>
                        </Box>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Company Name"
                                    name="companyName"
                                    value={profile.companyName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Contact Person"
                                    name="contactPerson"
                                    value={profile.contactPerson}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    name="address"
                                    value={profile.address}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    value={profile.description}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                        </Grid>

                        {isEditing && (
                            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button variant="contained" startIcon={<Save />} onClick={() => setIsEditing(false)}>
                                    Save Changes
                                </Button>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Profile;
