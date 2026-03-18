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
import StudyPlanPage from './components/StudyPlanPage';
import RolePortal from './components/RolePortal';

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
      <Route path="/" element={<RolePortal />} />

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
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/faculty/dashboard"
        element={
          <ProtectedRoute redirectTo="/faculty/login" allowedRoles={['faculty']}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

          {/* Study Plan Route */}
          <Route
            path="/study-plan"
            element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <StudyPlanPage />
              </ProtectedRoute>
            }
          />

          {/* Default redirect to role portal */}
          <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;