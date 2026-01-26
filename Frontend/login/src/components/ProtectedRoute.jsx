// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, redirectTo = '/student/login' }) {
  const token = localStorage.getItem('access_token') || localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to={redirectTo} />;
  }

  // If a token exists, render the component the user was trying to access
  return children;
}

export default ProtectedRoute;