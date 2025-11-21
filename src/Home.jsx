import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Pagination, 
  Stack,  
  FormControl,
  InputLabel,
  Select,
  MenuItem,    
} from "@mui/material";
import { useNavigate } from "react-router";
import { useAuth } from './AuthContext';


function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading ,token} = useAuth();
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortOrder , setSortOrder ] = useState('default');

  const [pageCount, setPageCount] = useState(0);
  const [currentPage , setCurrentPage] = useState(1);

  // const BACKEND_BASE_URL = "https://gl7gpk5d-8000.inc1.devtunnels.ms";
  // const INCORRECT_LOCAL_URL_PREFIX = "http://localhost:8000";

  useEffect(() => {

    if (authLoading) return;
    if (!isAuthenticated) return;

    setLoading(true);

    let apiURL = `/api/shoeDetails/?page=${currentPage}`;

    if (sortOrder !== 'default') {
        // 'ascending' maps to 'shoePrice', 'descending' maps to '-shoePrice'
        apiURL += `&ordering=${sortOrder}`; 
    }
    
    const config = {
      headers: {
        'Authorization': `Token ${token}` 
      }
    };
    

    axios
      .get(apiURL,config)
      .then((response) => {
        setShoes(response.data.results);
        setPageCount(Math.ceil(response.data.count /6));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data : ", error);
        setError(error);
        setLoading(false);
      });
  }, [isAuthenticated, authLoading, currentPage, sortOrder,token]);

  const handleSortChanges = (event) => {
    const value = event.target.value;

    const backendSortValue = value ==='ascending' ?'shoePrice':value === 'descending' ? '-shoePrice' : 'default';

    setSortOrder(backendSortValue);
    setCurrentPage(1);
  }

  const handleChange = (event,value) => {
    setCurrentPage(value);
    window.scrollTo(0,0);
  }


  if (loading || authLoading)
    return (
      <div>
        <Navbar/>
        <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
          <Typography>Loading shoes ....</Typography>
        </Container>
      </div>
    );
  if (error) return <div>Error : {error.message}</div>;



  return (
    <div>
      <Navbar />
      <Container component="main">

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <FormControl sx={{ width: 200 }} size="small">
            <InputLabel id="sort-select-label">Sort by Price</InputLabel>
            <Select 
            labelId="sort-select-label"
            id="sort-select"
            value={sortOrder === 'shoePrice' ? 'ascending' : sortOrder === '-shoePrice' ? 'descending' : 'default'}
            label="Sort by Price"
            onChange={handleSortChanges} > 
              <MenuItem value={'default'}>Default</MenuItem>
              <MenuItem value={'ascending'}>Price : Low to High</MenuItem>
              <MenuItem value={'descending'}>Price : High to Low</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box>
          <Grid container spacing={6} sx={{mt:4}}>
            {shoes.map((shoe) => {
              const getImageUrl = (imagePath) => {
                if (imagePath) {
                  // const correctedUrl = imagePath.replace(INCORRECT_LOCAL_URL_PREFIX, BACKEND_BASE_URL);
                  // return correctedUrl;
                  return imagePath;
                }
                return '';
              };

              return (
              <Grid key={shoe.id} >
                <Card onClick={() => navigate(`/shoeDetails/${shoe.id}`)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer", 
                    "&:hover": {
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="350px"
                    width="350px"
                    image={getImageUrl(shoe.shoeCoverImage)} 
                    alt={shoe.shoeName}
                  />

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2">
                      {shoe.shoeName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {shoe.shoeDescription}
                    </Typography>
                    <Typography gutterBottom variant="body1" component="h2">
                      MRP : ₹ {shoe.shoePrice}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )})}
          </Grid>
        </Box>

        <Stack spacing={2} sx={{alignItems:'center',m:10}}>
          <Pagination 
          count={pageCount}
          page={currentPage}
          onChange={handleChange}/>
        </Stack>

      </Container>
    </div>
  );
}

export default Home;
