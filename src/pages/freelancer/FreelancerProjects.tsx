import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const FreelancerProjects: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFreelancerProjects = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/projects/my-projects/freelancer", { 
          withCredentials: true 
        });
        setProjects(res.data.projects);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch projects.");
        console.error("Error fetching freelancer projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFreelancerProjects();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading your projects...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">My Projects</h2>
      {projects.length === 0 ? (
        <p>You have not been assigned to any projects yet.</p>
      ) : (
        projects.map((p) => (
          <div key={p._id} className="border rounded-md p-4 mb-3 shadow-sm bg-gray-50">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-200 text-gray-800">{p.status}</span>
            </div>
            
            <p className="text-sm text-gray-600">Client: {p.clientId?.username || 'N/A'}</p>
            <p className="text-sm text-gray-500">Budget: {p.finalAmount} {p.budget?.currency}</p>
            
            <div className="mt-4">
              {p.status === 'in-progress' && (
                <Link to={`/project/${p._id}/workspace`}>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
                    Go to Workspace
                  </button>
                </Link>
              )}
              
              {p.status === 'completed' && (
                <p className="font-semibold text-green-600">Project Completed</p>
              )}
            </div>
            
          </div>
        ))
      )}
    </div>
  );
};

export default FreelancerProjects;