import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  styled,
  FormHelperText,
  CircularProgress
} from "@mui/material";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate ,useParams} from "react-router";
import axios from 'axios';
import Navbar from "./Navbar";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAuth } from './AuthContext';


const validationSchema = yup.object({
  shoeName: yup.string().trim().required("Shoe name can't be empty."),
  shoeDescription: yup.string().trim().required("Shoe Details can't be empty."),
  shoePrice: yup
    .number()
    .typeError("Price must be a number")
    .required("Price can't be empty.")
    .positive("Price must be positive"),
  shoeInnerDescription: yup.string().trim().required("Shoe Description can't be empty."),
  shoeColorName: yup.string().trim().required("Color can't be empty."),
  shoeStyleName: yup.string().trim().required("Style Name can't be empty."),
  shoeOriginCountry: yup.string().trim().required("Origin Country can't be empty."),
});

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Max_file_size = 15 * 1024 * 1024;
// const BACKEND_BASE_URL = "https://gl7gpk5d-8000.inc1.devtunnels.ms";



function EditShoeForm() {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading ,token} = useAuth();
  const { id } = useParams();
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  const [csrfToken, setCsrfToken] = useState(null); 

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
        return; 
    }

    // axios.get(`${BACKEND_BASE_URL}/shoeDetails/${id}/`, {
    axios.get(`/shoeDetails/${id}/`, {
        headers: { 'Authorization': `Token ${token}` },
        withCredentials: true
    })
    .then(response => {
        const rawPrice = response.data.shoePrice;
        const cleanPrice = rawPrice.replace(/[\s,]/g, '');

        setInitialData({
            shoeName: response.data.shoeName,
            shoeDescription: response.data.shoeDescription,
            shoePrice: cleanPrice,
            shoeInnerDescription: response.data.shoeInnerDescription,
            shoeColorName: response.data.shoeColorName,
            shoeStyleName: response.data.shoeStyleName,
            shoeOriginCountry: response.data.shoeOriginCountry,
            // We initialize file fields as null/empty, user must re-upload or leave blank
            shoeCoverImageFile: null, 
            mainImageFiles: [],
        });
        setLoading(false);
    })
    .catch(err => {
        console.error("Error fetching shoe details:", err);
        setGeneralError("Failed to load existing shoe data.");
        setLoading(false);
    });
  }, [id, isAuthenticated, authLoading,token]);

  const formik = useFormik({
    initialValues: initialData || {
      shoeName: "", shoeDescription: "", shoePrice: "", shoeInnerDescription: "",
      shoeColorName: "", shoeStyleName: "", shoeOriginCountry: "",
      shoeCoverImageFile: null, mainImageFiles: [],
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => { 
      setGeneralError("");

      if (!isAuthenticated || !id) return;

      const FormDataToSend = new FormData();
      Object.keys(values).forEach(key => {
        if (key !== 'shoeCoverImageFile' && key !== 'mainImageFiles') {
            FormDataToSend.append(key, values[key]);
        }
      });
      
      if (values.shoeCoverImageFile instanceof File) {
        FormDataToSend.append("shoeCoverImage", values.shoeCoverImageFile, values.shoeCoverImageFile.name);
      }

      if (values.mainImageFiles.length > 0) {
        values.mainImageFiles.forEach((file, index) => {
            const fieldName = index === 0 ? 'shoeMainImage' : `shoeMainImage${index + 1}`;
            FormDataToSend.append(fieldName, file, file.name); 
        });
      }

      try {
        const response = await fetch(
          `${BACKEND_BASE_URL}/shoeDetails/${id}/`,
          {
            method: "PATCH",
            body: FormDataToSend,
            headers: {
              'Authorization': `Token ${token}` 
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setGeneralError(errorData.detail || JSON.stringify(errorData) || "An unexpected error occurred during submission.");
          console.error("Backend error:", errorData);
          return;
        }

        resetForm();
        navigate("/allDataForAdmin");
      } catch (networkError) {
        console.error("Network error during submission : ", networkError);
        setGeneralError("Network error. Please check your connection.");
      }
    },
  });

  const handleCoverImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("shoeCoverImageFile", file);
      formik.setFieldTouched("shoeCoverImageFile", true, false);
    }
  };

  const handleMainImagesChange = (event) => {
    const files = Array.from(event.currentTarget.files);
    
    if (files.length > 9) {
        formik.setFieldError("mainImageFiles", "You can only select a maximum of 9 images.");
        return;
    }

    formik.setFieldValue("mainImageFiles", files);
    formik.setFieldTouched("mainImageFiles", true, false);
  };

  

  if (loading|| authLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }



  return (
    <>
      <Navbar />
      <Container component="main" maxWidth="xs">
          <Box>
              <Typography component="h1" variant="h5">
                  Edit Shoe (ID: {id})
              </Typography>
              {generalError && <Alert severity="error">{generalError}</Alert>}
              <Box component="form" onSubmit={formik.handleSubmit}>
                
                  <TextField 
                      margin="normal" fullWidth id="shoeName" type="text" label="Shoe Name" name="shoeName"
                      value={formik.values.shoeName} 
                      onChange={formik.handleChange} 
                      onBlur={formik.handleBlur}
                      error={formik.touched.shoeName && !!formik.errors.shoeName} 
                      helperText={formik.touched.shoeName && formik.errors.shoeName} 
                      autoFocus
                  />
      
                  <TextField 
                      margin="normal" fullWidth id="shoeDescription" type="text" label="Shoe Description" name="shoeDescription"
                      value={formik.values.shoeDescription} 
                      onChange={formik.handleChange}  
                      onBlur={formik.handleBlur}
                      error={formik.touched.shoeDescription && !!formik.errors.shoeDescription} 
                      helperText={formik.touched.shoeDescription && formik.errors.shoeDescription}
                  />           
                  
              
                  <TextField 
                      margin="normal" fullWidth id="shoePrice" type="number" label="Shoe Price" name="shoePrice"
                      value={formik.values.shoePrice} 
                      onChange={formik.handleChange}  
                      onBlur={formik.handleBlur}
                      error={formik.touched.shoePrice && !!formik.errors.shoePrice} 
                      helperText={formik.touched.shoePrice && formik.errors.shoePrice}
                  />

                  <TextField 
                      margin="normal" fullWidth id="shoeInnerDescription" type="text" label="Shoe Inner Description" name="shoeInnerDescription"
                      value={formik.values.shoeInnerDescription} 
                      onChange={formik.handleChange}  
                      onBlur={formik.handleBlur}
                      error={formik.touched.shoeInnerDescription && !!formik.errors.shoeInnerDescription} 
                      helperText={formik.touched.shoeInnerDescription && formik.errors.shoeInnerDescription}
                  />  

                  <TextField 
                      margin="normal" fullWidth id="shoeColorName" type="text" label="Shoe Color" name="shoeColorName"
                      value={formik.values.shoeColorName} 
                      onChange={formik.handleChange}  
                      onBlur={formik.handleBlur}
                      error={formik.touched.shoeColorName && !!formik.errors.shoeColorName} 
                      helperText={formik.touched.shoeColorName && formik.errors.shoeColorName}
                  />

                  <TextField 
                      margin="normal" fullWidth id="shoeStyleName" type="text" label="Shoe Style Name" name="shoeStyleName"
                      value={formik.values.shoeStyleName} 
                      onChange={formik.handleChange}  
                      onBlur={formik.handleBlur}
                      error={formik.touched.shoeStyleName && !!formik.errors.shoeStyleName} 
                      helperText={formik.touched.shoeStyleName && formik.errors.shoeStyleName}
                  />

                  <TextField 
                      margin="normal" fullWidth id="shoeOriginCountry" type="text" label="Shoe Origin Country" name="shoeOriginCountry"
                      value={formik.values.shoeOriginCountry} 
                      onChange={formik.handleChange}  
                      onBlur={formik.handleBlur}
                      error={formik.touched.shoeOriginCountry && !!formik.errors.shoeOriginCountry} 
                      helperText={formik.touched.shoeOriginCountry && formik.errors.shoeOriginCountry}
                  />

                  <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '4px', mt: 2 }}>
                    <Typography variant="h6" gutterBottom>Upload Cover Image</Typography>
                    <Button component="label" variant="contained">
                        Select New Cover Image
                        <VisuallyHiddenInput type="file" accept="image/*" onChange={handleCoverImageChange} />
                    </Button>
                    {formik.values.shoeCoverImageFile && (<Typography variant="body2" sx={{ mt: 1 }}>Selected file: {formik.values.shoeCoverImageFile.name}</Typography>)}
                    {formik.touched.shoeCoverImageFile && formik.errors.shoeCoverImageFile && (
                        <FormHelperText error>{formik.errors.shoeCoverImageFile}</FormHelperText> 
                    )}
                  </Box>

                  <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '4px', mt: 2 }}>
                    <Typography variant="h6" gutterBottom>Upload Main Images (Max 9)</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Selecting new images will replace existing images.</Typography>
                    <Button component="label" variant="contained">
                        Select New Main Images
                        <VisuallyHiddenInput type="file" accept="image/*" multiple onChange={handleMainImagesChange} />
                    </Button>
                    {formik.values.mainImageFiles.length > 0 && (<Typography variant="body2" sx={{ mt: 1 }}>{formik.values.mainImageFiles.length} images selected.</Typography>)}
                    {formik.touched.mainImageFiles && formik.errors.mainImageFiles && (
                        <FormHelperText error>{formik.errors.mainImageFiles}</FormHelperText> 
                    )}
                  </Box>
            
      
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} >
                  Save Changes
              </Button>  
             
           </Box>
          </Box>
         </Container>
    </>
  );
}

export default EditShoeForm;
