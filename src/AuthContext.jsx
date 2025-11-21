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
      localStorage.removeItem(key); 
    }
  }
  return null; 
};

export const AuthProvider = ({ children }) => {

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


