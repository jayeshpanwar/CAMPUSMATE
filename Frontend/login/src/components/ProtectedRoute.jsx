// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, redirectTo = '/student/login', allowedRoles = [] }) {
  const token = localStorage.getItem('access_token') || localStorage.getItem('accessToken');
  const role = localStorage.getItem('user_role');

  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === 'faculty') {
      return <Navigate to="/faculty/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // If a token exists, render the component the user was trying to access
  return children;
}

export default ProtectedRoute;