import { Box, Button, Container,TextField, Typography,Alert} from '@mui/material';
import React, { useState,useEffect } from 'react';
import { useNavigate ,useLocation} from 'react-router'; 
import NavbarLogin from './NavbarLogin';
import {useFormik} from 'formik';
import * as yup from 'yup';
import { useAuth } from './AuthContext';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';

const validationSchema = yup.object({
  username :yup
    .string('Enter your Email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup 
    .string('Enter your password')
    .required('Password is required'),
})

function Login() {
   const navigate = useNavigate();
   const location = useLocation();
   const { login ,isAuthenticated } = useAuth(); 
  
  const [apiError, setApiError] = useState('');

  useEffect(() => {
      const queryParams = getQueryParams(location.search);
      const backendError = queryParams.get('error');
  
      if (backendError) {
        // Decode the URL-encoded error message (e.g., %20 becomes a space)
        const decodedError = decodeURIComponent(backendError);
        setApiError(decodedError);
        
        // Optional: Clean the URL after displaying the error
        navigate(location.pathname, { replace: true }); 
      }
    }, [location.search, navigate, location.pathname]);

  const getQueryParams = (locationSearch) => {
    return new URLSearchParams(locationSearch);
  };

  const formik = useFormik({
    initialValues:{
      username :'',
      password:'',
    },
    validationSchema:validationSchema,
    onSubmit : async(values , { setSubmitting , resetForm }) => {
      setApiError('');

      const dataToSend = {
        username:values.username,
        password: values.password
      };
      try {
        // const response = await fetch('https://gl7gpk5d-8000.inc1.devtunnels.ms/login/', {
        // const response = await fetch('http://127.0.0.1:8000/login/', {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error during Login : ', errorData);

          if (errorData.non_field_errors && errorData.non_field_errors.length > 0) {
            setApiError(errorData.non_field_errors[0]);
          } else if (errorData.username) {
            // Formik provides helper functions to set field-specific errors
            formik.setErrors({ username: errorData.username[0] });
          } else {
            setApiError("An unexpected error occurred.");
          }
          setSubmitting(false); // Enable the submit button again
        } else {
          const result = await response.json();
          console.log('Login successful:', result);

          // const { user } = result; 
          
          // // Pass both the token string and the user object to the login function
          // login( user); 

          const { token, user }= result; 
          login(token, user)
          
          resetForm(); // Reset Formik state
          navigate('/home');
        }
      } catch (networkError) {
        console.error("Network error during Login : ", networkError);
        setApiError("Network error: Could not connect to the server.");
        setSubmitting(false);
      }
    },
  });

  const onGoogleLoginSuccess = () => {
    const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
    const REDIRECT_URI = 'auth/api/login/google/';

    const scope = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ].join(' ');

    const backendBaseUrl = window.location.origin;

    const params = {
      response_type: 'code',
      client_id:  "226108938232-p6im1cbskiar62ao8o8htnodbbf22hq0.apps.googleusercontent.com",
      redirect_uri: `${backendBaseUrl}/${REDIRECT_URI}`,
      prompt: 'select_account',
      access_type: 'offline',
      scope
    };

    const urlParams = new URLSearchParams(params).toString();
    window.location = `${GOOGLE_AUTH_URL}?${urlParams}`;
  };


 return (
  <>
  <NavbarLogin/>
   <Container component="main" maxWidth="xs">
    <Box>
     <Typography component="h1" variant="h5">
      Login
     </Typography>
     <Box component="form" onSubmit={formik.handleSubmit}>
        {apiError && <Alert severity="error" sx={{ mt: 2, mb: 1 }}>{apiError}</Alert>}
      
      <TextField margin="normal" fullWidth id="username" type="email" label="Email Address" name="username"
          value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur} 
          error={formik.touched.username && Boolean(formik.errors.username)} 
          helperText={formik.touched.username && formik.errors.username}/>

       <TextField margin="normal" fullWidth id="password" type="password" label="Password" name="password"
          value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} 
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password} />

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={formik.isSubmitting}>
         Login
      </Button>

      <Button fullWidth
      variant='outlined' startIcon={<GoogleIcon/>}
      onClick={onGoogleLoginSuccess} sx={{mt:1,mb:2}} >
        Login in with Google
      </Button>

      <Button fullWidth
      variant='outlined' startIcon={<AppleIcon/>}
      onClick={onGoogleLoginSuccess} sx={{mt:1,mb:2}} >
        Login in with Apple
        
      </Button>
      
     </Box>
    </Box>
   </Container>
  </>
 );
}
export default Login;