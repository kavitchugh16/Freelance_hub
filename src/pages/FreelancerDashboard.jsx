// client/src/pages/FreelancerDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from './ui/Badge';
import { Briefcase, Star } from 'lucide-react';

const statusColors = {
  'In Progress': 'bg-blue-100 text-blue-800',
  'Completed': 'bg-green-100 text-green-800',
  'Submitted': 'bg-yellow-100 text-yellow-800',
};

const FreelancerDashboard = () => {
  const [activeProjects, setActiveProjects] = useState([]);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    console.log("Fetching freelancer's data...");
    setActiveProjects([
      { id: 4, title: 'E-commerce Site Backend', status: 'In Progress' }
    ]);
    setBids([
      { projectId: 1, projectTitle: 'Build a React Dashboard', status: 'Submitted' }
    ]);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Freelancer Dashboard</h1>

      {/* Active Projects */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">My Active Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeProjects.map(project => (
            <div
              key={project.id}
              className="p-4 border rounded-lg shadow flex flex-col justify-between transition hover:shadow-lg"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <Badge className={`px-2 py-1 rounded ${statusColors[project.status] || 'bg-gray-100 text-gray-800'}`}>
                  {project.status}
                </Badge>
              </div>
              <Link
                to={`/project/${project.id}/milestones`}
                className="mt-3 text-indigo-600 hover:underline font-medium"
              >
                Manage Milestones
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* My Bids */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">My Bids</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bids.map(bid => (
            <div
              key={bid.projectId}
              className="p-4 border rounded-lg shadow flex flex-col justify-between transition hover:shadow-lg"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">{bid.projectTitle}</h3>
                <Badge className={`px-2 py-1 rounded ${statusColors[bid.status] || 'bg-gray-100 text-gray-800'}`}>
                  {bid.status}
                </Badge>
              </div>
              <Link
                to={`/project/${bid.projectId}`}
                className="mt-3 text-indigo-600 hover:underline font-medium"
              >
                View Project
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
