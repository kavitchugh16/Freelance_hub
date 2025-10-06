// client/src/pages/ClientDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from './ui/Badge';
import { Building } from 'lucide-react';

const statusColors = {
  'Bidding Open': 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Completed': 'bg-green-100 text-green-800',
};

const ClientDashboard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    console.log("Fetching client's projects...");
    setProjects([
      { id: 1, title: 'Build a React Dashboard', status: 'Bidding Open' },
      { id: 4, title: 'E-commerce Site Backend', status: 'In Progress' },
      { id: 5, title: 'Landing Page Design', status: 'Completed' },
    ]);
  }, []);

  const total = projects.length;
  const active = projects.filter(p => p.status === 'In Progress').length;
  const bidding = projects.filter(p => p.status === 'Bidding Open').length;
  const completed = projects.filter(p => p.status === 'Completed').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Client Dashboard</h1>
        <Link
          to="/post-project"
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
        >
          Post New Project
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Projects', value: total, color: 'bg-gray-100 text-gray-800' },
          { label: 'Active Projects', value: active, color: 'bg-blue-100 text-blue-800' },
          { label: 'Bidding', value: bidding, color: 'bg-yellow-100 text-yellow-800' },
          { label: 'Completed', value: completed, color: 'bg-green-100 text-green-800' },
        ].map((stat, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow flex items-center justify-between ${stat.color} transition hover:shadow-xl`}
          >
            <div>
              <h3 className="text-lg font-semibold">{stat.label}</h3>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <Building className="h-8 w-8 text-gray-500" />
          </div>
        ))}
      </div>

      {/* Project List */}
      <h2 className="text-2xl font-semibold mb-4">My Projects</h2>
      <div className="space-y-4">
        {projects.map(project => (
          <div
            key={project.id}
            className="p-4 border rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center transition hover:shadow-lg"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h3 className="text-xl font-bold">{project.title}</h3>
              <Badge className={`px-2 py-1 rounded ${statusColors[project.status] || 'bg-gray-100 text-gray-800'}`}>
                {project.status}
              </Badge>
            </div>
            <Link
              to={`/project/${project.id}`}
              className="mt-2 md:mt-0 text-indigo-600 hover:underline font-medium"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientDashboard;
