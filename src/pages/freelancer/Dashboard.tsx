import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaWallet, 
  FaSearch,
  FaBriefcase,
  FaBell,
  FaComment // Icon for Messages
} from 'react-icons/fa';

const FreelancerDashboard: React.FC = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: 'Profile',
      description: 'Manage your profile & skills',
      icon: FaUser,
      color: 'from-indigo-500 to-purple-600',
      hoverColor: 'hover:from-indigo-600 hover:to-purple-700',
      route: '/freelancer/profile',
      delay: 'delay-0'
    },
    {
      title: 'Browse Projects',
      description: 'Find new opportunities',
      icon: FaSearch,
      color: 'from-emerald-500 to-teal-600',
      hoverColor: 'hover:from-emerald-600 hover:to-teal-700',
      route: '/freelancer/browse-projects',
      delay: 'delay-100'
    },
    {
      title: 'My Projects',
      description: 'Manage active projects',
      icon: FaBriefcase,
      color: 'from-amber-500 to-orange-600',
      hoverColor: 'hover:from-amber-600 hover:to-orange-700',
      route: '/freelancer/my-projects',
      delay: 'delay-200'
    },
    {
      title: 'Messages',
      description: 'View your conversations',
      icon: FaComment,
      color: 'from-sky-500 to-blue-600',
      hoverColor: 'hover:from-sky-600 hover:to-blue-700',
      route: '/messages', // Links to the messages page
      delay: 'delay-300'
    },
    {
      title: 'Wallet',
      description: 'View earnings & payments',
      icon: FaWallet,
      color: 'from-green-500 to-emerald-600',
      hoverColor: 'hover:from-green-600 hover:to-emerald-700',
      route: '/freelancer/wallet',
      delay: 'delay-400'
    },
    {
      title: 'Notifications',
      description: 'Stay updated',
      icon: FaBell,
      color: 'from-rose-500 to-pink-600',
      hoverColor: 'hover:from-rose-600 hover:to-pink-700',
      route: '/freelancer/notifications',
      delay: 'delay-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 p-6">
      {/* Header Section */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold gradient-text mb-2 text-shadow">
          Freelancer Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Welcome back! Find new opportunities and grow your freelance career.
        </p>
      </div>

      {/* Dashboard Cards Grid (Updated to lg:grid-cols-6) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
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
                <div className="w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 rounded-full"></div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* You can add the other sections from your FreelancerDashboard.jsx 
        (like "My Active Projects" and "My Bids") here if you want 
        this to be the main dashboard page.
      */}
      
    </div>
  );
};

export default FreelancerDashboard;