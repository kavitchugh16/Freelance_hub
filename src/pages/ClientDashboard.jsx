// client/src/pages/ClientDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from './ui/Badge';
import { Building, Plus, Eye, Clock, CheckCircle, Users } from 'lucide-react';

const statusColors = {
  'Bidding Open': 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200',
  'In Progress': 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200',
  'Completed': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200',
};

const ClientDashboard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    console.log("Fetching client's projects...");
    setProjects([
      { id: 1, title: 'Build a React Dashboard', status: 'Bidding Open', budget: '$2,500', proposals: 8 },
      { id: 4, title: 'E-commerce Site Backend', status: 'In Progress', budget: '$4,200', proposals: 12 },
      { id: 5, title: 'Landing Page Design', status: 'Completed', budget: '$1,800', proposals: 15 },
    ]);
  }, []);

  const total = projects.length;
  const active = projects.filter(p => p.status === 'In Progress').length;
  const bidding = projects.filter(p => p.status === 'Bidding Open').length;
  const completed = projects.filter(p => p.status === 'Completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2 text-shadow">
            Project Management
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your projects and track their progress
          </p>
        </div>
        <Link
          to="/post-project"
          className="button-primary mt-4 md:mt-0 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Post New Project</span>
        </Link>
      </div>


      {/* Project List */}
      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Projects</h2>
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`dashboard-card animate-scale-in delay-${index * 100}`}
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                    <Badge className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[project.status] || 'bg-gray-100 text-gray-800'}`}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Building className="h-4 w-4" />
                      <span>Budget: {project.budget}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{project.proposals} proposals</span>
                    </div>
                  </div>
                </div>
                
                <Link
                  to={`/project/${project.id}`}
                  className="button-secondary flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-6">Start by posting your first project to find talented freelancers.</p>
          <Link
            to="/post-project"
            className="button-primary inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Post Your First Project</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
