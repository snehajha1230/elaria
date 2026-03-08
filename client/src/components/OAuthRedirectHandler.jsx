import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const OAuthRedirectHandler = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get('https://elaria-server.onrender.com/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        login({ token, user: res.data.user });
        navigate('/home');
      })
      .catch((err) => {
        console.error('OAuth login failed', err);
        navigate('/login');
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-amber-100 via-white to-white text-black">
      <div className="m-auto text-center max-w-md p-8 bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-xl border border-gray-200">
        <div className="flex justify-center mb-6">
          <img 
            src="https://images.icon-icons.com/2108/PNG/512/google_icon_130924.png" 
            alt="Google Logo" 
            className="w-16 h-16 animate-bounce"
          />
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Completing Your Google Sign In</h1>
        
        <p className="text-lg mb-8 text-gray-600">
          Just a moment while we securely connect your Google account to Elaria...
        </p>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div className="bg-amber-500 h-2.5 rounded-full animate-pulse"></div>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Authenticating...</span>
        </div>
        
        <div className="mt-8 text-sm text-gray-400">
          <p>You'll be redirected to Home page automatically once verified</p>
        </div>
      </div>
    </div>
  );
};

export default OAuthRedirectHandler;