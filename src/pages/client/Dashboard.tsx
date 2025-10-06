import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaWallet, FaProjectDiagram, FaBell } from 'react-icons/fa';

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        className="bg-indigo-100 p-6 rounded-lg shadow-md flex flex-col items-center cursor-pointer hover:bg-indigo-200"
        onClick={() => navigate('/client/profile')}
      >
        <FaUser size={40} className="mb-2 text-indigo-600" />
        <h2 className="text-lg font-bold">Profile</h2>
      </div>

      <div
        className="bg-green-100 p-6 rounded-lg shadow-md flex flex-col items-center cursor-pointer hover:bg-green-200"
        onClick={() => navigate('/client/wallet')}
      >
        <FaWallet size={40} className="mb-2 text-green-600" />
        <h2 className="text-lg font-bold">Wallet</h2>
      </div>

      <div
        className="bg-yellow-100 p-6 rounded-lg shadow-md flex flex-col items-center cursor-pointer hover:bg-yellow-200"
        onClick={() => navigate('/client/projects/create')}
      >
        <FaProjectDiagram size={40} className="mb-2 text-yellow-600" />
        <h2 className="text-lg font-bold">Create Project</h2>
      </div>

      {/* ⬅️ CHANGE: Dedicated Notification Card */}
      <div
        className="bg-pink-100 p-6 rounded-lg shadow-md flex flex-col items-center cursor-pointer hover:bg-pink-200"
        onClick={() => navigate('/client/notifications')} // ⬅️ NEW Route for Notifications
      >
        <FaBell size={40} className="mb-2 text-pink-600" />
        <h2 className="text-lg font-bold">Notifications</h2> {/* ⬅️ Renamed */}
      </div>

      {/* ➡️ NEW: Re-add a card for My Projects/Project List */}
      <div
        className="bg-blue-100 p-6 rounded-lg shadow-md flex flex-col items-center cursor-pointer hover:bg-blue-200"
        onClick={() => navigate('/client/projects')}
      >
        <FaProjectDiagram size={40} className="mb-2 text-blue-600" />
        <h2 className="text-lg font-bold">My Projects</h2>
      </div>

    </div>
  );
};

export default ClientDashboard;