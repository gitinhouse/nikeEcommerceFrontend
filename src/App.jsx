import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./Home";
import Profile from "./Profile";
import Login from "./Login";
import Register from "./Register";
import SingleShoe from "./SingleShoe";
import NewHome from "./NewHome";
import ProtectedRoute from "./ProtectedRoute";
import AdminPage from "./AdminPage";
import AddShoeForm from "./AddShoeForm";
import EditShoeForm from "./EditShoeForm";
import SearchResult from "./SearchResult";
import GoogleAuthRedirect from './GoogleAuthRedirect';
import AppleAuthRedirect from "./AppleAuthRedirect";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/google-redirect-handler" element={<GoogleAuthRedirect />} /> 
        <Route path="/apple-redirect-handler" element={<AppleAuthRedirect/>}/>
        

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<NewHome />} />
          {/* <Route path="/home/" element={<GoogleAuthRedirect />} />  */}
          <Route path="/shoeDetails/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/shoeDetails/:id" element={<SingleShoe />} />
          <Route path="/allDataForAdmin" element={<AdminPage />} />
          <Route path="/addShoe" element={<AddShoeForm/>}/>
          <Route path="/editShoe/:id" element={<EditShoeForm/>}/>
          <Route path="/searchResults" element={<SearchResult/>}/>
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
