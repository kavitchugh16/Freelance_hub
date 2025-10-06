// client/src/pages/ProjectDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedBids, setExpandedBids] = useState({}); // Track which bid is expanded

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      console.log(`Fetching details for project ID: ${projectId}`);
      // Mock Data (replace with API call)
      setProject({
        id: projectId,
        title: 'Build a React Dashboard',
        description: 'Detailed description of the project requirements goes here. We need a dynamic dashboard with charts and data tables.',
        budget: 1500,
        skills: ['React', 'Node.js', 'Charts.js'],
        bids: [
          { id: 1, freelancer: 'Jane Doe', amount: 1400, proposal: 'I can get this done quickly.' },
          { id: 2, freelancer: 'John Smith', amount: 1350, proposal: 'Experienced with React and data viz.' },
          { id: 3, freelancer: 'Alice Cooper', amount: 1450, proposal: 'I will provide detailed charts with animations.' }
        ]
      });
      setLoading(false);
    };

    fetchProjectDetails();
  }, [projectId]);

  if (loading) return <p className="text-center mt-20 text-gray-600">Loading project details...</p>;
  if (!project) return <p className="text-center mt-20 text-gray-600">Project not found.</p>;

  const toggleBid = (id) => {
    setExpandedBids(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Project Summary */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
          <h1 className="text-3xl font-bold text-blue-900">{project.title}</h1>
          <p className="mt-2 text-gray-700 text-lg">{project.description}</p>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {project.skills.map(skill => (
                <span
                  key={skill}
                  className="inline-block bg-indigo-50 text-indigo-800 font-semibold px-3 py-1 rounded-full text-sm transition-transform hover:scale-105"
                >
                  {skill}
                </span>
              ))}
            </div>
            <div className="text-xl font-semibold text-gray-800 bg-gray-100 px-4 py-2 rounded-xl shadow-inner">
              Budget: ${project.budget}
            </div>
          </div>
        </div>

        {/* Bids Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-blue-900">Bids</h2>
          {project.bids.length === 0 && (
            <p className="text-gray-600">No bids have been placed yet.</p>
          )}
          {project.bids.map(bid => (
            <div
              key={bid.id}
              className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => toggleBid(bid.id)}
            >
              <div className="flex justify-between items-center p-4">
                <div>
                  <p className="font-semibold text-gray-800">{bid.freelancer}</p>
                  <p className="text-gray-600 text-sm">Bid: ${bid.amount}</p>
                </div>
                <div>
                  {expandedBids[bid.id] ? <ChevronUp className="w-5 h-5 text-indigo-600" /> : <ChevronDown className="w-5 h-5 text-indigo-600" />}
                </div>
              </div>
              {expandedBids[bid.id] && (
                <div className="border-t border-gray-200 p-4 bg-gray-50 text-gray-700 text-sm">
                  {bid.proposal}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
