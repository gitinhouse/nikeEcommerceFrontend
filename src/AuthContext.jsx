import React, { createContext, useState, useContext, useEffect ,useMemo} from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const safelyParseJson = (key) => {
  const item = localStorage.getItem(key);
  if (item && item !== 'undefined' && item !== 'null') {
    try {
      return JSON.parse(item);
    } catch (e) {
      console.error("Error parsing localStorage key:", key, e);
      localStorage.removeItem(key); // Clear the bad data
    }
  }
  return null; // Return null if invalid or not found
};

export const AuthProvider = ({ children }) => {
  // Use the safe parser for initial state
  const [token, setToken] = useState(localStorage.getItem('userToken'));
  const [user, setUser] = useState(safelyParseJson('user')); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData); 
    localStorage.setItem('userToken', newToken);
    localStorage.setItem('user', JSON.stringify(userData)); 
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('userToken');
    localStorage.removeItem('user'); 
  };

  const isAuthenticated = !!token;
  const isAdmin = user ? user.is_staff : false;
  const userEmail = user ? user.username : null;
  console.log("Admin status : ",isAdmin)

  const contextValue = useMemo(() => ({ 
    token, user, isAuthenticated, login, logout, isAdmin, userEmail, loading 
  }), [token, user, isAuthenticated, isAdmin, userEmail, loading, login, logout]);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout ,isAdmin,userEmail}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);




// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); 
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true); // Add loading state

//   useEffect(() => {
//     // Function to verify authentication status with the backend
//     const verifyAuthStatus = async () => {
//       try {
//         // Adjust this URL to match your Django endpoint path
//         const response = await axios.get('https://gl7gpk5d-8000.inc1.devtunnels.ms/auth/api/login/user/', {
//              withCredentials: true // Important for sending/receiving cookies
//         });
//         if (response.data.isAuthenticated) {
//           setUser(response.data);
//           setIsAuthenticated(true);
//         }
//       } catch (error) {
//         // Not authenticated, likely a 401 response
//         setUser(null);
//         setIsAuthenticated(false);
//       } finally {
//         setLoading(false); // Stop loading regardless of outcome
//       }
//     };

//     verifyAuthStatus();
//   }, []); // Run only once on component mount

//   // ... (login and logout functions might need adjustment if you switch to session auth completely)
//   const login = (userData) => { // Login might just set the user data locally after a successful status check
//     setUser(userData); 
//     setIsAuthenticated(true);
//   };

//   const logout = () => {
//     setUser(null);
//     setIsAuthenticated(false);
//     // Optionally call a Django logout API endpoint here
//   };

  

//   const isAdmin = user ? user.is_staff : false;
//   const userEmail = user ? user.username : null;

//   return (
//     <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, isAdmin, userEmail }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
