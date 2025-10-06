import React, { useEffect, useState } from "react";
import axios from "axios";

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/projects", { withCredentials: true });
        setProjects(res.data.projects || res.data); // handle both backend structures
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">All Projects</h2>
      {projects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        projects.map((p) => (
          <div key={p._id} className="border rounded-md p-4 mb-3 shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold">{p.title}</h3>
            <p>{p.description}</p>
            <p className="text-sm text-gray-500">Category: {p.category}</p>
            <p className="text-sm text-gray-500">Budget: ${p.budget?.amount}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ProjectList;
