import React, { useEffect ,useState} from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from './AuthContext';

function GoogleAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login,isAuthenticated } = useAuth();

  const [processed, setProcessed] = useState(false);

  useEffect(() => {

    if (isAuthenticated || processed) {
        if (isAuthenticated && location.pathname === '/google-redirect-handler') {
            navigate('/home', { replace: true });
        }
        return; 
    }

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    
    if (token) {
      const userData = {
        username: queryParams.get('username'),
        firstname: queryParams.get('firstname'),
        lastname: queryParams.get('lastname'),
        is_staff: queryParams.get('is_staff') === 'true', 
      };
      
      login(token, userData);
      setProcessed(true); 
    //   navigate('/home', { replace: true });
    } else {
      navigate('/?error=Google login failed to provide a token', { replace: true });
    }
  }, [location, navigate, login, isAuthenticated, processed]);

  return <div>Processing Google Login...</div>;
}

export default GoogleAuthRedirect;
