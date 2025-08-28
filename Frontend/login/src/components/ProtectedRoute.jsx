// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // Check for the access token in localStorage
  const token = localStorage.getItem('accessToken');

  // If there's no token, redirect the user to the login page
  if (!token) {
    return <Navigate to="/student/login" />;
  }

  // If a token exists, render the component the user was trying to access
  return children;
}

export default ProtectedRoute;