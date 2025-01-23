// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './context/authContext';

const ProtectedRoute = ({ element }) => {
  const { isAdmin, isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    // If the user is not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    // If the user is logged in but not an admin, redirect to home page or another page
    return <Navigate to="/" />;
  }

  return element; // Render the protected component
};

export default ProtectedRoute;
