import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";
import {
  Box,
  CardMedia,
  Container,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import Navbar from "./Navbar";
import { useAuth } from "./AuthContext";
import './SingleShoe.css';

// const BACKEND_BASE_URL = "https://gl7gpk5d-8000.inc1.devtunnels.ms";
// const INCORRECT_LOCAL_URL_PREFIX = "http://localhost:8000";

const getImageUrl = (imagePath) => {
  if (imagePath) {
    // const correctedUrl = imagePath.replace(
    //   INCORRECT_LOCAL_URL_PREFIX,
    //   BACKEND_BASE_URL
    // );
    // return correctedUrl;
    return imagePath;
  }
  return "";
};

function SingleShoe() {
  const [shoe, setShoe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImageSrc, setMainImageSrc] = useState("");
  const { id } = useParams();
  const { isAuthenticated, loading: authLoading  ,token} = useAuth();

  const handleThumbnailHover = (newImageSrc) => {
    setMainImageSrc(newImageSrc);
  };
  const renderThumbnail = (imagePath, index) => {
    if (!imagePath || !shoe) return null;

    const src = getImageUrl(imagePath);
    return (
      <CardMedia
        key={index}
        component="img"
        image={src}
        alt={shoe.shoeName}
        sx={{
          height: 70,
          width: 120,
          objectFit: "contain",
          cursor: "pointer",
        }}
        onMouseEnter={() => handleThumbnailHover(src)}
      />
    );
  };

  useEffect(() => { 
    if (authLoading) return;
    if (!isAuthenticated) return;

    setLoading(true);

    // const apiURL = `${BACKEND_BASE_URL}/shoeDetails/${id}/`;
    const apiURL = `/shoeDetails/${id}/`;

    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    axios
      .get(apiURL ,config)
      .then((response) => {
        setShoe(response.data);
        setLoading(false);
        setMainImageSrc(getImageUrl(response.data.shoeMainImage));
      })
      .catch((error) => {
        console.error("Error fetching data : ", error);
        setError(error);
        setLoading(false);
      });
  }, [id, isAuthenticated, authLoading,token]);

  if (loading || authLoading)
    return (
      <div>
        <Navbar />
        <Container sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
          <Typography>Loading shoe ....</Typography>
        </Container>
      </div>
    );
  if (error) return <div>Error : {error.message}</div>;
  if (!shoe) {
    return (
      <div>
        <Navbar />
        Shoe not found.
      </div>
    );
  }

  const allImagePaths = [
    shoe.shoeMainImage,
    shoe.shoeMainImage2,
    shoe.shoeMainImage3,
    shoe.shoeMainImage4,
    shoe.shoeMainImage5,
    shoe.shoeMainImage6,
    shoe.shoeMainImage7,
    shoe.shoeMainImage8,
    shoe.shoeMainImage9,
  ];

  return (
    <div>
      <Navbar />
      <Container component="main" sx={{ mt: 4 }}>
        <Box
          spacing={4}
          sx={{
            width: "100%",
            display: "flex",
            margin: "0 auto",
            position: "relative",
            gap: "20px",
          }}
        >
          <Box
            sx={{
              width: "10%",
              position: "sticky",
              top: "10px",
              alignSelf: "flex-start",
              maxHeight: "calc(100vh - 70px)",
              display: "flex",
              flexDirection: "column",
              gap: "11px",
            }}
          >
            {allImagePaths.map((path, index) => renderThumbnail(path, index))}
          </Box>
          <Box
            sx={{
              width: "50%",
              position: "sticky",
              top: "10px",
              alignSelf: "flex-start",
              maxHeight: "calc(100vh - 70px)",
            }}
          >
            <CardMedia
              component="img"
              image={mainImageSrc}
              alt={shoe.shoeName}
              sx={{ maxHeight: 760, objectFit: "contain" }}
            />
          </Box>

          <Box sx={{ width: "30%", ml: 6 }}>
            <Typography variant="h5" component="h1">
              {shoe.shoeName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {shoe.shoeDescription}
            </Typography>
            <Typography variant="body1">MRP : ₹ {shoe.shoePrice}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Inclusive of all taxes <br />
              (Also includes all applicable duties)
            </Typography>

            <Typography variant="h6">Select Sizes : </Typography>
            <Box id='SelectSizeButtons'>
              {['UK 6','UK 6.5','UK 7','UK 7.5','UK 8','UK 8.5','UK 9',' UK 9.5','UK 10','UK 10.5','UK 11','UK 11.5'].map((id)=>{
                return<Button key={id}>{id}</Button>;
              })}
            </Box>

            <Button
              fullWidth
              sx={{
                backgroundColor: "black",
                color: "white",
                borderRadius: "25px",
                padding: "12px",
                mt: 5,
              }}
            >
              Add to Cart
            </Button>
            <Button
              fullWidth
              sx={{
                backgroundColor: "white",
                color: "black",
                border: "1px solid",
                borderRadius: "25px",
                padding: "10px",
                mt: 1,
              }}
            >
              Favorite
            </Button>

            <Typography variant="body1" sx={{ mt: 2 }}>
              {shoe.shoeInnerDescription}
            </Typography>
            <Box variant="body1" sx={{ mt: 3 }}>
              <ul>
                <li>Colour Shown :{shoe.shoeColorName}</li>
                <li>Style:{shoe.shoeStyleName}</li>
                <li>Country/Region of Origin: {shoe.shoeOriginCountry}</li>
              </ul>
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default SingleShoe;
