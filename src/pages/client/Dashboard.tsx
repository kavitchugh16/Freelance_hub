import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaWallet, 
  FaPlus,
  FaFolderOpen,
  FaBell,
  FaComment // Icon for Messages
} from 'react-icons/fa';

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: 'Profile',
      description: 'Manage your profile settings',
      icon: FaUser,
      color: 'from-indigo-500 to-purple-600',
      hoverColor: 'hover:from-indigo-600 hover:to-purple-700',
      route: '/client/profile',
      delay: 'delay-0'
    },
    {
      title: 'Wallet',
      description: 'View balance and transactions',
      icon: FaWallet,
      color: 'from-emerald-500 to-teal-600',
      hoverColor: 'hover:from-emerald-600 hover:to-teal-700',
      route: '/client/wallet',
      delay: 'delay-100'
    },
    {
      title: 'Create Project',
      description: 'Post a new project',
      icon: FaPlus,
      color: 'from-amber-500 to-orange-600',
      hoverColor: 'hover:from-amber-600 hover:to-orange-700',
      route: '/client/projects/create',
      delay: 'delay-200'
    },
    {
      title: 'My Projects',
      description: 'Manage your projects',
      icon: FaFolderOpen,
      color: 'from-blue-500 to-cyan-600',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-700',
      route: '/client/projects',
      delay: 'delay-300'
    },
    {
      title: 'Messages',
      description: 'View your conversations',
      icon: FaComment,
      color: 'from-sky-500 to-blue-600',
      hoverColor: 'hover:from-sky-600 hover:to-blue-700',
      route: '/messages', // Links to the messages page
      delay: 'delay-400'
    },
    {
      title: 'Notifications',
      description: 'View your notifications',
      icon: FaBell,
      color: 'from-rose-500 to-pink-600',
      hoverColor: 'hover:from-rose-600 hover:to-pink-700',
      route: '/client/notifications',
      delay: 'delay-500' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header Section */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold gradient-text mb-2 text-shadow">
          Client Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Welcome back! Manage your projects and grow your business.
        </p>
      </div>

      {/* Dashboard Cards Grid (Updated to lg:grid-cols-3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.title}
              className={`dashboard-card group cursor-pointer animate-scale-in ${card.delay}`}
              onClick={() => navigate(card.route)}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Icon with gradient background */}
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${card.color} ${card.hoverColor} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <IconComponent size={32} className="text-white" />
                </div>
                
                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-gray-500 transition-colors">
                    {card.description}
                  </p>
                </div>
                
                {/* Hover indicator */}
                <div className="w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full"></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="mt-12 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="dashboard-card">
          <div className="space-y-4">
            {[
              { action: 'Project "E-commerce Website" completed', time: '2 hours ago', status: 'success' },
              { action: 'New proposal received for "Mobile App"', time: '4 hours ago', status: 'info' },
              { action: 'Payment of $2,500 processed', time: '1 day ago', status: 'success' },
              { action: 'Project "Logo Design" started', time: '2 days ago', status: 'info' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-3 h-3 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                } animate-pulse`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;