import { Box, Button, Checkbox, Container, FormControl, FormLabel, FormGroup, FormControlLabel,
 TextField, Typography, InputLabel, Select, MenuItem, OutlinedInput, Alert,
 styled, FormHelperText } from '@mui/material';
import React, { useRef , useState ,useEffect,useCallback} from 'react';
import { useNavigate } from 'react-router'; 
import NavbarLogin from './NavbarLogin';
import { useFormik } from 'formik';
import * as yup from 'yup'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const StatesList = [
  'Haryana','Punjab','Himachal'
];
const CityList = [
  'Panchkula','Mohali','Solan'
];

const validationSchema = yup.object({
  firstname: yup.string()
    .trim()
    .required("Firstname can't be empty.")
    .matches(/^[A-Za-z\s-]+$/, "Firstname can only contain letters."),
  lastname: yup.string()
    .trim()
    .required("Lastname can't be empty.")
    .matches(/^[A-Za-z\s-]+$/, "Lastname can only contain letters."),
  username: yup.string()
    .trim()
    .email("Email must follow proper format.")
    .required("Email can't be empty."),
  age: yup.number()
    .typeError("Age must be a number")
    .required("Age can't be empty.")
    .positive("Age must be positive")
    .integer("Age must be an integer"),
  password: yup.string()
    .required("Password can't be empty."),
  confirmpassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required("Confirm Password can't be empty."),
  hobbies: yup
    .array() 
    .min(1, 'Hobbies must be selected.'),
  state: yup
    .string()
    .required('State must be selected.'),
  city: yup
    .string()
    .required('City must be selected.'),
  imageUploaded: yup.boolean().oneOf([true], "An image must be uploaded."),
});

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function Register() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [imageError, setImageError] = useState(''); 
  const [generalError, setGeneralError] = useState('');
  
  const selectedImageRef = useRef(selectedImage);

  useEffect(() => {
    selectedImageRef.current = selectedImage;
  }, [selectedImage]);

  const handleSubmit = useCallback(async (values, { resetForm, setFieldError }) => {
  setImageError('');
  setGeneralError('');

    const FormDataToSend = new FormData();
    Object.keys(values).forEach(key => {
      if (key !== 'confirmpassword'){
        if (key === 'hobbies' && Array.isArray(values[key])) {
            FormDataToSend.append(key, values[key].join(','));
        } else {
            FormDataToSend.append(key, values[key]);
        }
      }
    });

    if (selectedImageRef.current){
      FormDataToSend.append('image', selectedImageRef.current, selectedImageRef.current.name);
    }
    try {
        // const response = await fetch('https://gl7gpk5d-8000.inc1.devtunnels.ms/',{
        // const response = await fetch('http://127.0.0.1:8000/',{
        const response = await fetch('/register/', {
          method:'POST',
          body: FormDataToSend,
        })
        console.log("Submitting data:", values, selectedImageRef.current); 
        
        if (!response.ok) {
            const errorData = await response.json();
            
            if (errorData.username) {
                setFieldError('username', errorData.username[0]); 
                return; // Stop execution here, do not proceed to success steps or navigation
            } else {
                // Handle other potential non-field-specific errors
                setGeneralError('An unexpected error occurred during registration.');
                console.error("Backend error:", errorData);
                return; // Stop execution
            }
        }

        resetForm(); 
        setSelectedImage(null);
        if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
        setImagePreviewUrl(null);

        navigate('/');
    } catch (networkError) {
        console.error("Network error during Registration : ", networkError);
        setGeneralError('Network error. Please check your connection.');
    }
  }, [selectedImage, imagePreviewUrl, navigate]);

  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      username: '',
      age: '',
      password: '',
      confirmpassword: '',
      state: '', 
      city: '',
      hobbies: [],
      imageUploaded: false,
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });


  const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        setSelectedImage(file);
        setImagePreviewUrl(URL.createObjectURL(file));
        setImageError(''); 
        formik.setFieldValue('imageUploaded', true); // Update Formik value
      } else {
        setSelectedImage(null);
        setImagePreviewUrl(null);
        setImageError('Please select a valid image file.'); 
        formik.setFieldValue('imageUploaded', false); // Update Formik value
      }
  };

  const removeImage = () => {
      setSelectedImage(null);
      setImageError("An image must be uploaded."); 
      formik.setFieldValue('imageUploaded', false); // Update Formik value
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
        setImagePreviewUrl(null);
      }
  };


 return (
  <>
  <NavbarLogin/>
   <Container component="main" maxWidth="xs">
    <Box>
        <Typography component="h1" variant="h5">
            Register
        </Typography>
        {generalError && <Alert severity="error">{generalError}</Alert>}
        <Box component="form" onSubmit={formik.handleSubmit}>
          
            <TextField 
                margin="normal" fullWidth id="firstname" type="text" label="First Name" name="firstname"
                value={formik.values.firstname} 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} // Add onBlur for validation on touch
                error={formik.touched.firstname && !!formik.errors.firstname} 
                helperText={formik.touched.firstname && formik.errors.firstname} 
                autoFocus
            />

            <TextField 
                margin="normal" fullWidth id="lastname" type="text" label="Last Name" name="lastname"
                value={formik.values.lastname} 
                onChange={formik.handleChange}  
                onBlur={formik.handleBlur}
                error={formik.touched.lastname && !!formik.errors.lastname} 
                helperText={formik.touched.lastname && formik.errors.lastname}
            />

            <TextField 
                margin="normal" fullWidth id="username" type="email" label="Email Address" name="username"
                value={formik.values.username} 
                onChange={formik.handleChange}  
                onBlur={formik.handleBlur}
                // The error check now correctly uses Formik state, including backend errors set via setFieldError
                error={formik.touched.username && !!formik.errors.username} 
                helperText={formik.touched.username && formik.errors.username}
            />
            
            
        
            <TextField 
                margin="normal" fullWidth id="age" type="number" label="Age" name="age"
                value={formik.values.age} 
                onChange={formik.handleChange}  
                onBlur={formik.handleBlur}
                error={formik.touched.age && !!formik.errors.age} 
                helperText={formik.touched.age && formik.errors.age}
            />
        
            <FormControl component="fieldset" margin="normal" error={formik.touched.hobbies && !!formik.errors.hobbies}>
                <FormLabel component="legend">Select Hobbies</FormLabel>
                <FormGroup row>
                    <FormControlLabel
                        control={<Checkbox checked={formik.values.hobbies.includes('singing')} onChange={(e) => {
                            // Manual handling for checkboxes within Formik
                            const selected = e.target.checked;
                            const currentHobbies = [...formik.values.hobbies];
                            if (selected) {
                                currentHobbies.push('singing');
                            } else {
                                const index = currentHobbies.indexOf('singing');
                                if (index > -1) currentHobbies.splice(index, 1);
                            }
                            formik.setFieldValue('hobbies', currentHobbies);
                        }} name="singing" />}
                        label="Singing"
                    />
                    <FormControlLabel
                         control={<Checkbox checked={formik.values.hobbies.includes('dancing')} onChange={(e) => {
                            const selected = e.target.checked;
                            const currentHobbies = [...formik.values.hobbies];
                            if (selected) {
                                currentHobbies.push('dancing');
                            } else {
                                const index = currentHobbies.indexOf('dancing');
                                if (index > -1) currentHobbies.splice(index, 1);
                            }
                            formik.setFieldValue('hobbies', currentHobbies);
                        }} name="dancing" />}
                        label="Dancing"
                    />
                </FormGroup>
                {formik.touched.hobbies && formik.errors.hobbies && <FormHelperText>{formik.errors.hobbies}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth margin="normal" error={formik.touched.state && !!formik.errors.state}>
                <InputLabel id="state-label">State</InputLabel>
                <Select
                    labelId="state-label"
                    id="state"
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange} // Formik handles change and value update
                    onBlur={formik.handleBlur}
                    input={<OutlinedInput label="State" />}
                    MenuProps={MenuProps}
                >
                    {StatesList.map((state) => (
                        <MenuItem key={state} value={state}>
                            {state}
                        </MenuItem>
                    ))}
                </Select>
                {formik.touched.state && formik.errors.state && <FormHelperText>{formik.errors.state}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth margin="normal" error={formik.touched.city && !!formik.errors.city}>
                <InputLabel id="city-label">City</InputLabel>
                <Select
                    labelId="city-label"
                    id="city"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    input={<OutlinedInput label="City" />}
                    MenuProps={MenuProps}
                >
                    {CityList.map((city) => (
                        <MenuItem key={city} value={city}>
                            {city}
                        </MenuItem>
                    ))}
                </Select>
                 {formik.touched.city && formik.errors.city && <FormHelperText>{formik.errors.city}</FormHelperText>}
            </FormControl>
              
            <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
            <Typography variant="h6" gutterBottom>
                Upload Image
            </Typography>
            

        {imagePreviewUrl ? (
            <Box sx={{ mb: 2 }}>
            <img
                src={imagePreviewUrl}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
            />
            <Button onClick={removeImage} color="secondary" variant="outlined" sx={{ mt: 1 }}>
                Remove Image
            </Button>
            </Box>
            ) : (
            <Button
                component="label" 
                variant="contained"
            >
                Upload Image
                <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                />
            </Button>
            )}
            {formik.touched.imageUploaded && formik.errors.imageUploaded && 
            <FormHelperText error>{formik.errors.imageUploaded}</FormHelperText> }
        </Box>
        

            <TextField 
                margin="normal" fullWidth id="password" type="password" label="Password" name="password"
                value={formik.values.password} 
                onChange={formik.handleChange}  
                onBlur={formik.handleBlur}
                error={formik.touched.password && !!formik.errors.password} 
                helperText={formik.touched.password && formik.errors.password}
            />

            <TextField 
                margin="normal" fullWidth id="confirmpassword" type="password" label="Confirm Password" name="confirmpassword"
                value={formik.values.confirmpassword} 
                onChange={formik.handleChange}  
                onBlur={formik.handleBlur}
                error={formik.touched.confirmpassword && !!formik.errors.confirmpassword} 
                helperText={formik.touched.confirmpassword && formik.errors.confirmpassword}
            />

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} >
            Register
        </Button>  
       
     </Box>
    </Box>
   </Container>
  </>
 );
}

export default Register;