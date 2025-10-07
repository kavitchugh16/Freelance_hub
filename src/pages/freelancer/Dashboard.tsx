import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaWallet, 
  FaProjectDiagram, 
  FaBell, 
  FaSearch,
  FaBriefcase
} from 'react-icons/fa';

const FreelancerDashboard = () => {
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
      route: '/freelancer/projects',
      delay: 'delay-200'
    },
    {
      title: 'Wallet',
      description: 'View earnings & payments',
      icon: FaWallet,
      color: 'from-green-500 to-emerald-600',
      hoverColor: 'hover:from-green-600 hover:to-emerald-700',
      route: '/freelancer/wallet',
      delay: 'delay-300'
    },
    {
      title: 'Notifications',
      description: 'Stay updated',
      icon: FaBell,
      color: 'from-rose-500 to-pink-600',
      hoverColor: 'hover:from-rose-600 hover:to-pink-700',
      route: '/freelancer/notifications',
      delay: 'delay-400'
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


      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => {
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

      {/* Recent Activity & Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        {/* Recent Activity */}
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="dashboard-card">
            <div className="space-y-4">
              {[
                { action: 'Project "Mobile App Design" completed', time: '1 hour ago', status: 'success' },
                { action: 'New proposal submitted for "E-commerce Site"', time: '3 hours ago', status: 'info' },
                { action: 'Payment of $1,200 received', time: '1 day ago', status: 'success' },
                { action: 'Client left 5-star review', time: '2 days ago', status: 'success' }
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

        {/* Featured Opportunities */}
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Opportunities</h2>
          <div className="space-y-4">
            {[
              { 
                title: 'React Native Mobile App', 
                budget: '$3,000 - $5,000', 
                skills: ['React Native', 'Firebase', 'UI/UX'],
                timeLeft: '2 days left'
              },
              { 
                title: 'E-commerce Website', 
                budget: '$2,500 - $4,000', 
                skills: ['React', 'Node.js', 'MongoDB'],
                timeLeft: '5 days left'
              },
              { 
                title: 'Logo Design Package', 
                budget: '$500 - $800', 
                skills: ['Adobe Illustrator', 'Branding', 'Design'],
                timeLeft: '1 day left'
              }
            ].map((project, index) => (
              <div key={index} className="dashboard-card hover:shadow-medium transition-all duration-300 cursor-pointer">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900">{project.title}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {project.timeLeft}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-green-600">{project.budget}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
