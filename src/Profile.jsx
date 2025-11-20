// src/Profile.jsx

import React from 'react';
import Navbar from './Navbar';
// Import the hook we created in AuthContext
import { useAuth } from './AuthContext'; 

// Import Material UI components for a better display
import { Container, Typography, Box, Card, CardContent, CircularProgress } from '@mui/material';

function Profile() {
  // Destructure the 'user' object from the Auth context
  const { user } = useAuth();

  // Handle the case where the user data might not be loaded yet (though unlikely if behind ProtectedRoute)
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

  // Once 'user' is available, you can display its properties:
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
                        {/* You can display the image here if your Django backend provides the full URL */}
                        {/* {user.image && <img src={user.image} alt="Profile" style={{ marginTop: '16px', maxWidth: '200px' }} />} */}
                    </Box>
                </CardContent>
            </Card>
        </Container>
    </div>
  );
}

export default Profile;
