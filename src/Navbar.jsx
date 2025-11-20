import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  InputBase,
} from "@mui/material";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "500px", 
  marginLeft:'70px',
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "450px",

    },
  },
}));

function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const { userEmail, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`/searchResults?q=${searchQuery}`);
    console.log(searchQuery);
  };
  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'rgb(0, 0, 0)', color: 'rgb(255, 255, 255)', padding: ' 10px' }}>
        <Toolbar sx={{ display:'flex', justifyContent:'space-between', padding: 0 }}>
          <Typography
            variant="h3"
            component={Link}
            to="/home"
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            Nike
          </Typography>

          <form onSubmit={handleSearchSubmit}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search.."
                inputProps={{ "aria-label": "search" }}
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Search>
          </form>

          <Box 
            sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 1,
                '& a': {
                    textDecoration: 'none',
                    color: 'inherit',
                    marginLeft: '10px',
                },
                '& button': { 
                    marginLeft: '10px',
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '10px',
                    border: 'none',
                    borderRadius: '5px',
                    '&:hover': {
                        backgroundColor: 'darkred',
                    }
                }
            }}
          >
            <Button color="inherit" component={Link} to="/shoeDetails/">Shoes</Button>
            <Button color="inherit" component={Link} to="/profile">Profile</Button>

            {isAdmin && (
              <Button color="inherit" component={Link} to="/allDataForAdmin">
                Manage shoes
              </Button>
            )}

            <Button onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        sx={{ 
            backgroundColor: 'rgb(216, 216, 216)', 
            textAlign: 'center', 
            padding: '10px' 
        }}
      >
        <Typography variant="body2" sx={{color:'black'}}>
          10% Import Tax Reduction Discount with code: GEARUP
        </Typography>
      </Box>
    </>
  );
}

export default Navbar;
