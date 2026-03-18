import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Users, Lock } from 'lucide-react';
import './RolePortal.css';

const RolePortal = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    if (role === 'student') {
      navigate('/student/login');
    } else if (role === 'faculty') {
      navigate('/faculty/login');
    } else if (role === 'admin') {
      navigate('/admin/login');
    }
  };

  return (
    <div className="role-portal-container">
      <div className="role-portal-content">
        <div className="role-portal-header">
          <h1>CampusMate</h1>
          <p>Select your role to continue</p>
        </div>

        <div className="role-cards-container">
          {/* Student Card */}
          <div className="role-card" onClick={() => handleRoleSelect('student')}>
            <div className="role-icon student-icon">
              <User size={48} />
            </div>
            <h2>Student</h2>
            <p>Access student dashboard, attendance, and study plans</p>
            <button className="role-button student-button">
              Continue as Student
            </button>
          </div>

          {/* Faculty Card */}
          <div className="role-card" onClick={() => handleRoleSelect('faculty')}>
            <div className="role-icon faculty-icon">
              <Users size={48} />
            </div>
            <h2>Faculty</h2>
            <p>Manage classes, attendance, and student tasks</p>
            <button className="role-button faculty-button">
              Continue as Faculty
            </button>
          </div>

          {/* Admin Card */}
          <div className="role-card" onClick={() => handleRoleSelect('admin')}>
            <div className="role-icon admin-icon">
              <Lock size={48} />
            </div>
            <h2>Administrator</h2>
            <p>Manage system, users, and configurations</p>
            <button className="role-button admin-button">
              Continue as Admin
            </button>
          </div>
        </div>

        <div className="role-portal-footer">
          <p>CampusMate © 2026. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default RolePortal;
