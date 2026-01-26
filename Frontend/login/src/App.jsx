// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Import all your page components
import StudentLogin from './components/StudentLogin';
import StudentSignup from './components/StudentSignup';
import FacultyLogin from './components/FacultyLogin';
import FacultySignup from './components/FacultySignup';
import AdminLogin from './components/AdminLogin';
import AdminSignup from './components/AdminSignup';
import Dashboard from './components/Dashboard';
import TeacherDashboard from './components/TeacherDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

// We create this helper component so we can use the useNavigate hook
function AppRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Student Routes */}
      <Route 
        path="/student/login" 
        element={<StudentLogin onSwitch={() => navigate('/student/verify')} />} 
      />
      <Route 
        path="/student/verify" 
        element={<StudentSignup onSwitch={() => navigate('/student/login')} />} 
      />

      {/* Faculty Routes */}
      <Route 
        path="/faculty/login" 
        element={<FacultyLogin onSwitch={() => navigate('/faculty/signup')} />} 
      />
      <Route 
        path="/faculty/signup" 
        element={<FacultySignup onSwitch={() => navigate('/faculty/login')} />} 
      />

      {/* Admin Routes */}
      <Route 
        path="/admin/login" 
        element={<AdminLogin onSwitch={() => navigate('/admin/signup')} />} 
      />
      <Route 
        path="/admin/signup" 
        element={<AdminSignup onSwitch={() => navigate('/admin/login')} />} 
      />

      {/* Protected Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/faculty/dashboard"
        element={
          <ProtectedRoute redirectTo="/faculty/login">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      {/* Default redirect to the student login page */}
      <Route path="*" element={<Navigate to="/student/login" />} />
    </Routes>
  );
}

export default App;