import React from 'react';
import Navbar from './Navbar';
import { useAuth } from './AuthContext'; 

import { Container, Typography, Box, Card, CardContent, CircularProgress } from '@mui/material';

function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div>
        <Navbar/>
        <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
          <Typography>Loading profile details...</Typography>
        </Container>
      </div>
    );
  }

  return (
    <div>
        <Navbar/>
        <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>My Profile</Typography>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Welcome, {user.firstname} {user.lastname}!
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1"><strong>Email:</strong> {user.username}</Typography>
                        <Typography variant="body1"><strong>Age:</strong> {user.age}</Typography>
                        <Typography variant="body1"><strong>Location:</strong> {user.city}, {user.state}</Typography>
                        <Typography variant="body1"><strong>Hobbies:</strong> {user.hobbies}</Typography>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    </div>
  );
}

export default Profile;
