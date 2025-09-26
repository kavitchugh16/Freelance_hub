// client/src/pages/FreelancerDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FreelancerDashboard = () => {
    const [activeProjects, setActiveProjects] = useState([]);
    const [bids, setBids] = useState([]);

    useEffect(() => {
        // Fetch freelancer's active projects and bids
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

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">My Active Projects</h2>
                {activeProjects.map(project => (
                    <div key={project.id} className="p-4 border rounded-lg shadow flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold">{project.title}</h3>
                            <p className="text-sm text-gray-500">Status: {project.status}</p>
                        </div>
                        {/* We will create MilestoneItem component later */}
                        <Link to={`/project/${project.id}/milestones`} className="text-indigo-600 hover:underline">
                            Manage Milestones
                        </Link>
                    </div>
                ))}
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">My Bids</h2>
                {bids.map(bid => (
                    <div key={bid.projectId} className="p-4 border rounded-lg shadow flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold">{bid.projectTitle}</h3>
                            <p className="text-sm text-gray-500">Status: {bid.status}</p>
                        </div>
                         <Link to={`/project/${bid.projectId}`} className="text-indigo-600 hover:underline">
                            View Project
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FreelancerDashboard;