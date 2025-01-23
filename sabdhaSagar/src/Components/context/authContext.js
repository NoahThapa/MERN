import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../../Config/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(''); // Store the userId

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get('/auth/profile');
        console.log("Auth response:", response.data);
        setIsLoggedIn(true);
        setUsername(response.data.username);
        setUserId(response.data._id); // Set the userId

        if (response.data.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUsername('');
        setUserId(''); // Reset userId if not logged in
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, username, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
