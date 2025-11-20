import React,{useState, useEffect} from 'react';
import { useNavigate , useLocation } from 'react-router';
import { useAuth } from './AuthContext';


function AppleAuthRedirect() {
    const navigate = useNavigate();
    const location = useLocation();
    const {login , isAuthhenticated} = useAuth();

    const [processed , setProcessed] = useState(false);

    useEffect(()=>{
        if (isAuthhenticated || processed){
            if(isAuthhenticated && location === '/apple-redirect-handler'){
                navigate('/home', {replace:true});
            }
            return;
        }

        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            const userData = {
                username: queryParams.get('username'),
                firstname : queryParams.get('firstname'),
                lastname : queryParams.get('lastname'),
                is_staff : queryParams.get('is_staff') === 'true',
            };

            login(token , userData);
            setProcessed(true);
        }
        else{
            navigate('/?error=Apple Login failed to provide a token' , {replace:true});
        }
    } , [location,navigate,login,isAuthhenticated,processed]);

  return (
    <div>Processing Apple Login ...</div>
  )
}

export default AppleAuthRedirect