import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  styled,
  FormHelperText,
} from "@mui/material";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import Navbar from "./Navbar";
import { useFormik } from "formik"; // Import useFormik
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
  shoeInnerDescription: yup.string().trim().required("Shoe Decription can't be empty."),
  shoeColorName: yup.string().trim().required("Color can't be empty."),
  shoeStyleName: yup.string().trim().required("Style Name can't be empty."),
  shoeOriginCountry: yup.string().trim().required("Origin Country can't be empty."),
  shoeCoverImageFile: yup
    .mixed()
    .required("A cover image is required.")
    .test("fileSize", "Image is too large (max 15MB).", (value) => {
        return value && value.size <= Max_file_size;
    }),
  mainImageFiles: yup
    .array()
    .min(1, "Upload at least one image.")
    .max(9, "You can upload a maximum of 9 main images.")
    .required("Upload at least one image")
    .test(
      "fileSize",
      "One or more images are too large (max 15MB).",
      (value) => {
        if (!value || value.length === 0) return true;
        return value.every((file) => file.size <= Max_file_size);
      }
    ),
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

function AddShoeForm() {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading ,token} = useAuth();
  const [generalError, setGeneralError] = useState("");

  const formik = useFormik({
    initialValues: {
      shoeName: "",
      shoeDescription: "",
      shoePrice: "",
      shoeInnerDescription: "",
      shoeColorName: "",
      shoeStyleName: "",
      shoeOriginCountry: "",
      shoeCoverImageFile: null, 
      mainImageFiles: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => { 
      setGeneralError("");

      if (!isAuthenticated) {
        setGeneralError("Authentication is missing. Please log in.");
        return;
      }

      const FormDataToSend = new FormData();
      
      FormDataToSend.append("shoeName", values.shoeName);
      FormDataToSend.append("shoeDescription", values.shoeDescription);
      FormDataToSend.append("shoePrice", values.shoePrice);
      FormDataToSend.append("shoeInnerDescription", values.shoeInnerDescription);
      FormDataToSend.append("shoeColorName", values.shoeColorName);
      FormDataToSend.append("shoeStyleName", values.shoeStyleName);
      FormDataToSend.append("shoeOriginCountry", values.shoeOriginCountry);
      
      if (values.shoeCoverImageFile) {
        FormDataToSend.append("shoeCoverImage", values.shoeCoverImageFile, values.shoeCoverImageFile.name);
      }

      if (values.mainImageFiles.length > 0) {
          const firstMainImage = values.mainImageFiles[0];
          FormDataToSend.append("shoeMainImage", firstMainImage, firstMainImage.name);
      }
      for (let i = 1; i < values.mainImageFiles.length; i++) {
        const file = values.mainImageFiles[i];
        // The index will start at 1, so field name should start at 2 (i+1+1 or i+2 is fine)
        FormDataToSend.append(`shoeMainImage${i + 1}`, file, file.name); 
      }

      try {
        // const response = await fetch("https://gl7gpk5d-8000.inc1.devtunnels.ms/shoeDetails/",{
        const response = await fetch("/api/shoeDetails/",{
            method: "POST",
            body: FormDataToSend,
            // headers: {
            //   'X-CSRFToken': csrftoken 
            // },
            // credentials: "include"
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
      formik.setFieldTouched("shoeCoverImageFile", true, false); // Mark as touched for validation UI
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



  return (
    <>
      <Navbar />
      <Container component="main" maxWidth="xs">
          <Box>
              <Typography component="h1" variant="h5">
                  Add New Shoe
              </Typography>
              {generalError && <Alert severity="error">{generalError}</Alert>}
              <Box component="form" onSubmit={formik.handleSubmit}>
                
                  <TextField 
                      margin="normal" fullWidth id="shoeName" type="text" label="Shoe Name" name="shoeName"
                      value={formik.values.shoeName} 
                      onChange={formik.handleChange} 
                      onBlur={formik.handleBlur} // Add onBlur for validation on touch
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
                    <Typography variant="h6" gutterBottom>
                        Upload Cover Image
                    </Typography>
                    
                    <Button component="label" variant="contained">
                        {formik.values.shoeCoverImageFile ? 'Change Image' : 'Upload Image'}
                        <VisuallyHiddenInput
                            type="file"
                            accept="image/*"
                            onChange={handleCoverImageChange}
                        />
                    </Button>
                    {formik.values.shoeCoverImageFile && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {formik.values.shoeCoverImageFile.name}
                        </Typography>
                    )}
                    {formik.touched.shoeCoverImageFile && formik.errors.shoeCoverImageFile && (
                        <FormHelperText error>{formik.errors.shoeCoverImageFile}</FormHelperText> 
                    )}
                  </Box>

                  <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '4px', mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Upload Main Images (Max 9)
                    </Typography>
                    <Button component="label" variant="contained">
                        Select Main Images
                        <VisuallyHiddenInput
                            type="file"
                            accept="image/*"
                            multiple // Allows multiple file selection
                            onChange={handleMainImagesChange}
                        />
                    </Button>
                    {formik.values.mainImageFiles.length > 0 && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {formik.values.mainImageFiles.length} images selected.
                        </Typography>
                    )}
                    {formik.touched.mainImageFiles && formik.errors.mainImageFiles && (
                        <FormHelperText error>{formik.errors.mainImageFiles}</FormHelperText> 
                    )}
                  </Box>
            
      
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} >
                  Add Shoe
              </Button>  
             
           </Box>
          </Box>
         </Container>
    </>
  );
}

export default AddShoeForm;
