import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams, Link , useNavigate} from "react-router";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  CardMedia,
  Card,
  CardContent,
  Grid,
  Stack,
  Pagination,
} from "@mui/material";
import Navbar from "./Navbar";
import { useAuth } from "./AuthContext";
import axios from "axios";

// const BACKEND_BASE_URL = "https://gl7gpk5d-8000.inc1.devtunnels.ms";
// const INCORRECT_LOCAL_URL = "http://localhost:8000";

const getImageUrl = (imagePath) => {
  if (imagePath) {
    // const correctedUrl = imagePath.replace(
    //   INCORRECT_LOCAL_URL,
    //   BACKEND_BASE_URL
    // );
    // return correctedUrl;
    return imagePath;
  }
  return "";
};

function SearchResult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, loading: authLoading ,token } = useAuth();

  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    // const apiUrl = `${BACKEND_BASE_URL}/shoeDetails/?search=${encodeURIComponent(
    const apiUrl = `/shoeDetails/?search=${encodeURIComponent(
      query
    )}&page=${currentPage}`;

    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    axios
      .get(apiUrl, config)
      .then((response) => {
        setResults(response.data.results);
        setPageCount(Math.ceil(response.data.count / 6));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching search results : ", err);
        setError(err);
        setLoading(false);
      });
  }, [query, isAuthenticated, authLoading, currentPage,token]);

  const handleChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };

  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Search Results for "{query}"
        </Typography>
        {loading || authLoading ?(
          <CircularProgress />
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "40px",
            }}
          >
            {results.length > 0 ? (
              results.map((shoe) => (
                <Grid key={shoe.id}>
                  <Card
                    onClick={() => navigate(`/shoeDetails/${shoe.id}`)}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      // height:"470px",
                      // width:"350px",
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
                      <Typography
                        gutterBottom
                        color="text.secondary"
                        variant="body1"
                        component="h2"
                      >
                        MRP : ₹ {shoe.shoePrice}
                      </Typography>
                      <Typography
                        gutterBottom
                        color="text.secondary"
                        variant="body1"
                        component="h2"
                      >
                        Style : {shoe.shoeStyleName}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography>No Match Found</Typography>
            )}
          </Box>
        )}
        <Stack spacing={2} sx={{ alignItems: "center", m: 10 }}>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={handleChange}
          />
        </Stack>
      </Container>
    </>
  );
}

export default SearchResult;
