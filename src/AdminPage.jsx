import React, { useState, useEffect } from "react";
import "./AdminPage.css";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate, Link } from "react-router";
import { useAuth } from "./AuthContext";
import {
 Container,
  CircularProgress,
  Alert,
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableFooter,
  FormControl,
  InputLabel, 
  Select,   
  MenuItem ,
  TextField,
} from "@mui/material";

function AdminPage() {
  const navigate = useNavigate();
  const { isAuthenticated,loading: authLoading ,token} = useAuth();
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generalError, setGeneralError] = useState("");

  const [totalCount,setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const [sortByField, setSortByField] = useState('id'); 
  const [sortDirection, setSortDirection] = useState('asc');

  const [searchQuery, setSearchQuery] = useState('');

  const [searchInputLocal, setSearchInputLocal] = useState(''); 

  const getBackendOrdering = (field, direction) => {
    if (direction === 'desc') {
      return `-${field}`;
    }
    return field;
  };

  const BACKEND_BASE_URL = "https://gl7gpk5d-8000.inc1.devtunnels.ms";
  const INCORRECT_LOCAL_URL_PREFIX = "http://localhost:8000";

  useEffect(() => {
    if (authLoading) return; 
    if (!isAuthenticated) return; 

    setLoading(true);

    const backendOrderingParam = getBackendOrdering(sortByField, sortDirection);
    let apiURL = `${BACKEND_BASE_URL}/shoeDetails/?page=${page + 1}&ordering=${backendOrderingParam}`;

    if (searchQuery) {
        apiURL += `&search=${encodeURIComponent(searchQuery)}`;
    }

    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    axios
      // .get(apiURL, {withCredentials:true })
      .get(apiURL,config)
      .then((response) => {
        setShoes(response.data.results);
        setTotalCount(response.data.count);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data : ", error);
        setError(error);
        setLoading(false);
      });
  }, [token,isAuthenticated, authLoading, page, sortByField, sortDirection,searchQuery]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value , 10));
    setPage(0);
  }

  const handleSortFieldChange = (event) => {
    setSortByField(event.target.value);
    setPage(0); 
  };

  const handleSortDirectionChange = (event) => {
    setSortDirection(event.target.value);
    setPage(0);
  };

  const handleLocalSearchChange = (event) => {
    setSearchInputLocal(event.target.value);
  };

  const executeSearch = () => {
    setSearchQuery(searchInputLocal);
    setPage(0);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      executeSearch();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shoe ?")) {
      return;
    }

    if (!isAuthenticated || !id) {
      setGeneralError("Authentication required or shoe ID missing.");
      return;
    }
    // const csrftoken = getCookie('csrftoken');
    
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/shoeDetails/${id}/`, {
        method: "DELETE",
        // credentials: "include",
        // headers: {
        //   'X-CSRFToken': csrftoken 
        // },
        headers: {
              'Authorization': `Token ${token}` 
            },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setGeneralError(errorData.detail || "Failed to delete the shoe.");
        console.error("Backend error:", errorData);
        return;
      }
      setShoes((prevShoes) => prevShoes.filter((shoe) => shoe.id !== id));
    
    } catch (networkError) {
      console.error("Network error during deletion : ", networkError);
      setGeneralError("Network error. Please check your connection.");
    }
  };

  if (loading || authLoading )
    return (
      <div>
        <Navbar />
        <Container sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
          <Typography>Loading shoes ....</Typography>
        </Container>
      </div>
    );
  if (error) return <div>Error : {error.message}</div>;

  const truncateDescription = (text, wordLimit) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "..."; 
    }
    return text;
  };

  const headCells = [
    { id: 'id', numeric: true, label: 'ID' },
    { id: 'shoeName', numeric: false, label: 'Name' },
    { id: 'shoePrice', numeric: true, label: 'Price' },
    { id: 'shoeColorName', numeric: false, label: 'Color' },
    { id: 'shoeStyleName', numeric: false, label: 'Style Name' },
    { id: 'shoeOriginCountry', numeric: false, label: 'Origin' },
    { id: 'image', numeric: false, label: 'Image' },
    { id: 'action', numeric: false, label: 'Action' },
  ];

  return (
    <>
    
      <Navbar />
      <Container maxWidth="xl">
      {generalError && <Alert severity="error">{generalError}</Alert>}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: 'center',
          mt: 4,
          mb: 2
        }}
      >
        <h1>All Shoes Data</h1>

        <TextField
            label="Search Shoes"
            variant="outlined"
            size="small"
            value={searchInputLocal} 
            onChange={handleLocalSearchChange}
            onKeyDown={handleKeyDown}
            sx={{ width: 300 }}
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ width: 150 }}>
                <InputLabel id="sort-field-label">Sort By</InputLabel>
                <Select
                    labelId="sort-field-label"
                    value={sortByField}
                    label="Sort By"
                    onChange={handleSortFieldChange}
                >
                    <MenuItem value={'id'}>ID</MenuItem>
                    <MenuItem value={'shoePrice'}>Price</MenuItem>
                </Select>
            </FormControl>

            <FormControl size="small" sx={{ width: 150 }}>
                <InputLabel id="sort-direction-label">Order</InputLabel>
                <Select
                    labelId="sort-direction-label"
                    value={sortDirection}
                    label="Order"
                    onChange={handleSortDirectionChange}
                >
                    <MenuItem value={'asc'}>Ascending</MenuItem>
                    <MenuItem value={'desc'}>Descending</MenuItem>
                </Select>
            </FormControl>

            <Button variant="contained" color="primary" component={Link} to="/addShoe">
                Add New Shoe +
            </Button>
        </Box>
        
      </Box>

      <TableContainer component={Paper}>
        <Table >
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell key={headCell.id}
                align={headCell.numeric ?'right' :'left'} >
                    {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {shoes.map((shoe) => {
              const getImageUrl = (imagePath) => {
                if(imagePath){
                  const correctedUrl = imagePath.replace(INCORRECT_LOCAL_URL_PREFIX,BACKEND_BASE_URL);
                  return correctedUrl;
                }
                return "";
              };
              return (
                <TableRow key={shoe.id} hover>
                  <TableCell component="th" scope="row" align="right">{shoe.id}</TableCell>
                  <TableCell align="left">{shoe.shoeName}</TableCell>
                  <TableCell align="right">₹ {shoe.shoePrice}</TableCell>
                  <TableCell align="left">{truncateDescription(shoe.shoeColorName, 3)}</TableCell>
                  <TableCell align="left">{shoe.shoeStyleName}</TableCell>
                  <TableCell align="left">{shoe.shoeOriginCountry}</TableCell>
                  <TableCell align="left">
                    <img
                      style={{ width: "100px" }}
                      src={getImageUrl(shoe.shoeCoverImage)}
                      alt={shoe.shoeName}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <Button variant="outlined" color="primary" size="small" onClick={() => navigate(`/shoeDetails/${shoe.id}`)}>View</Button>
                    <Button variant="outlined" size="small" onClick={() => navigate(`/editShoe/${shoe.id}`)} sx={{borderColor:'#ff5722',color:'#ff5722',ml: 1}}>Edit</Button>
                    <Button variant="outlined" size="small" onClick={() => handleDelete(shoe.id)} sx={{borderColor:'red',color:'red',ml: 1}}>Delete</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[6]}
                colSpan={headCells.length}
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

    </Container>
    </>
  );
}

export default AdminPage;
