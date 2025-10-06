// src/pages/client/Profile.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaEnvelope, FaBuilding, FaGlobe, FaInfoCircle } from 'react-icons/fa';

const ClientProfile = () => {
  const { user } = useAuth();

  return (
    <div className="flex justify-center mt-10">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">Client Profile</h1>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FaUser className="text-indigo-500 text-xl" />
            <p><strong>Username:</strong> {user?.username}</p>
          </div>

          <div className="flex items-center gap-3">
            <FaEnvelope className="text-indigo-500 text-xl" />
            <p><strong>Email:</strong> {user?.email}</p>
          </div>

          <div className="flex items-center gap-3">
            <FaBuilding className="text-indigo-500 text-xl" />
            <p><strong>Company:</strong> {user?.company}</p>
          </div>

          <div className="flex items-center gap-3">
            <FaGlobe className="text-indigo-500 text-xl" />
            <p><strong>Country:</strong> {user?.country}</p>
          </div>

          <div className="flex items-center gap-3">
            <FaInfoCircle className="text-indigo-500 text-xl" />
            <p><strong>Description:</strong> {user?.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
