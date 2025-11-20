import React from 'react'
import { Link } from 'react-router';
import './Navbar.css';

function NavbarLogin() {
  return (
    <div id='NavbarDiv'>
            <h1>Nike</h1>
            <div>
                <Link to="/register">Register</Link>
                <Link to="/">Login</Link>
            </div>
        </div>
  )
}

export default NavbarLogin