// client/src/pages/ClientDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ClientDashboard = () => {
    const [projects, setProjects] = useState([]);
    
    useEffect(() => {
        // Fetch projects posted by this client
        console.log("Fetching client's projects...");
        setProjects([
            { id: 1, title: 'Build a React Dashboard', status: 'Bidding Open' },
            { id: 4, title: 'E-commerce Site Backend', status: 'In Progress' }
        ]);
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Client Dashboard</h1>
                <Link to="/post-project" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">
                    Post New Project
                </Link>
            </div>

            <h2 className="text-2xl font-semibold mb-4">My Projects</h2>
            <div className="space-y-4">
                {projects.map(project => (
                    <div key={project.id} className="p-4 border rounded-lg shadow flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold">{project.title}</h3>
                            <p className="text-sm text-gray-500">Status: {project.status}</p>
                        </div>
                        <Link to={`/project/${project.id}`} className="text-indigo-600 hover:underline">
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClientDashboard;