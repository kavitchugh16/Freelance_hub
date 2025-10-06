// src/pages/freelancer/Dashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const FreelancerDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Freelancer Dashboard</h1>
      <p>Welcome, {user?.username}!</p>

      <div>
        <p>Applied Projects: 0</p>
        <p>Ongoing Projects: 0</p>
        <p>Portfolio Views: 0</p>
      </div>

      
    </div>
  );
};

export default FreelancerDashboard;
