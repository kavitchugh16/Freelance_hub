// src/pages/client/Dashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ClientDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Client Dashboard</h1>
      <p>Welcome, {user?.username}!</p>

      <div>
        <p>Total Projects: 0</p>
        <p>Ongoing Projects: 0</p>
        <p>Applications Received: 0</p>
      </div>

      
    </div>
  );
};

export default ClientDashboard;
