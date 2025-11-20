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
} from "@mui/material";
import { useNavigate } from "react-router";
import { useAuth } from './AuthContext'; 

function NewHome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div>
      <Navbar />
      {user && (
        <Box sx={{ padding: '20px', backgroundColor: '#f5f5f5', textAlign: 'center' }}>
          <Typography variant="h5">
            Welcome back, {user.username}! 
          </Typography>
        </Box>
      )}
      <CardMedia
        sx={{ mt: 4 }}
        onClick={() => navigate(`/shoeDetails/5`)}
        component="img"
        image="/Screenshot_2025-11-17_15-17-45.png"
      />
      <div style={{ textAlign: "center" ,marginBottom:'40px'}}>
        <div style={{ fontSize: "80px" }}>
          <b>KICKS THAT CAN'T MISS</b>
          <p style={{ fontSize: "18px" }}>
            Gift the perfect sneakers for their every move <br />
            <button
            onClick={() => navigate(`/shoeDetails/5`)}
            style={{
                marginTop:'15px',
              backgroundColor: "black",
              color: "white",
              borderRadius: "25px",
              padding: "10px 15px",
              border: "none",
            }}
          >
            Shop
          </button>
          </p>
          
        </div>
      </div>

      <CardMedia
        sx={{ mt: 4 }}
        onClick={() => navigate(`/shoeDetails/9`)}
        component="img"
        image="/Screenshot_2025-11-17_15-22-59.png"
      />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "80px" }}>
            <p style={{ fontSize: "18px" }}>
            Jordan
          </p>
          <b>COLDEST IN THE GAME</b> <br />
          
          <button
            onClick={() => navigate(`/shoeDetails/9`)}
            style={{
              backgroundColor: "black",
              color: "white",
              borderRadius: "25px",
              padding: "10px 15px",
              border: "none",
            }}
          >
            Shop
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewHome;
