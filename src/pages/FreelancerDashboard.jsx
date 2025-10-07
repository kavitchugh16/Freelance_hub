// client/src/pages/FreelancerDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from './ui/Badge';
import { Briefcase, Star, Clock, CheckCircle, Eye, TrendingUp, DollarSign, Award } from 'lucide-react';

const statusColors = {
  'In Progress': 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200',
  'Completed': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200',
  'Submitted': 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200',
  'Under Review': 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border border-purple-200',
};

const FreelancerDashboard = () => {
  const [activeProjects, setActiveProjects] = useState([]);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    console.log("Fetching freelancer's data...");
    setActiveProjects([
      { 
        id: 4, 
        title: 'E-commerce Site Backend', 
        status: 'In Progress',
        budget: '$4,200',
        deadline: 'Dec 15, 2024',
        progress: 65
      },
      { 
        id: 5, 
        title: 'Mobile App UI/UX Design', 
        status: 'In Progress',
        budget: '$2,800',
        deadline: 'Dec 20, 2024',
        progress: 30
      }
    ]);
    setBids([
      { 
        projectId: 1, 
        projectTitle: 'Build a React Dashboard', 
        status: 'Under Review',
        bidAmount: '$2,500',
        submittedDate: '2 days ago'
      },
      { 
        projectId: 2, 
        projectTitle: 'Logo Design Package', 
        status: 'Submitted',
        bidAmount: '$800',
        submittedDate: '1 week ago'
      }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 p-6">
      {/* Header Section */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold gradient-text mb-2 text-shadow">
          Freelancer Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your projects and track your freelance journey
        </p>
      </div>


      {/* Active Projects */}
      <div className="mb-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Active Projects</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeProjects.map((project, index) => (
            <div
              key={project.id}
              className={`dashboard-card animate-scale-in delay-${index * 100}`}
            >
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                  <Badge className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[project.status] || 'bg-gray-100 text-gray-800'}`}>
                    {project.status}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Budget: {project.budget}</span>
                    <span>Deadline: {project.deadline}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <Link
                  to={`/project/${project.id}/milestones`}
                  className="button-secondary flex items-center justify-center space-x-2 w-full"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Manage Milestones</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Bids */}
      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bids</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bids.map((bid, index) => (
            <div
              key={bid.projectId}
              className={`dashboard-card animate-scale-in delay-${index * 100}`}
            >
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-xl font-bold text-gray-900">{bid.projectTitle}</h3>
                  <Badge className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[bid.status] || 'bg-gray-100 text-gray-800'}`}>
                    {bid.status}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Bid Amount: {bid.bidAmount}</span>
                    <span>Submitted: {bid.submittedDate}</span>
                  </div>
                </div>
                
                <Link
                  to={`/project/${bid.projectId}`}
                  className="button-secondary flex items-center justify-center space-x-2 w-full"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Project</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty States */}
      {activeProjects.length === 0 && bids.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No active projects or bids</h3>
          <p className="text-gray-600 mb-6">Start by browsing projects and submitting proposals to grow your freelance business.</p>
          <Link
            to="/freelancer/browse-projects"
            className="button-primary inline-flex items-center space-x-2"
          >
            <Star className="h-5 w-5" />
            <span>Browse Projects</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default FreelancerDashboard;
