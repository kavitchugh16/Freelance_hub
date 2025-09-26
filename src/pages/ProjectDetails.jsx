// client/src/pages/ProjectDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProjectDetails = () => {
  const { projectId } = useParams(); // Gets the project ID from the URL
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder for fetching a single project's details
    const fetchProjectDetails = async () => {
      setLoading(true);
      console.log(`Fetching details for project ID: ${projectId}`);
      // const data = await api.getProjectById(projectId);
      // setProject(data);
      // Mock Data
       setProject({ 
        id: projectId, 
        title: 'Build a React Dashboard', 
        description: 'Detailed description of the project requirements goes here. We need a dynamic dashboard with charts and data tables.',
        budget: 1500, 
        skills: ['React', 'Node.js', 'Charts.js'],
        bids: [
            { id: 1, freelancer: 'Jane Doe', amount: 1400, proposal: 'I can get this done quickly.'},
            { id: 2, freelancer: 'John Smith', amount: 1350, proposal: 'Experienced with React and data viz.'}
        ]
      });
      setLoading(false);
    };

    fetchProjectDetails();
  }, [projectId]);

  if (loading) {
    // return <Loader />;
    return <p>Loading project details...</p>;
  }
  
  if (!project) {
    return <p>Project not found.</p>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{project.title}</h1>
      <p className="mt-2 text-lg text-gray-700">{project.description}</p>
      <p className="mt-4 text-xl font-semibold">Budget: ${project.budget}</p>
      <div className="mt-4">
        <h3 className="text-lg font-bold">Required Skills:</h3>
        {project.skills.map(skill => (
          <span key={skill} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{skill}</span>
        ))}
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Bids</h2>
        {/* We will map over BidCard components here */}
        {project.bids.map(bid => (
             <div key={bid.id} className="border p-4 rounded-lg shadow mt-4">
                <p className="font-bold">{bid.freelancer} - ${bid.amount}</p>
                <p className="text-gray-600">{bid.proposal}</p>
             </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetails;