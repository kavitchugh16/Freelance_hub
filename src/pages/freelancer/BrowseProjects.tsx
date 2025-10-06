import React, { useEffect, useState } from "react";
import axios from "axios";

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  budget: { amount: number; currency: string };
  experienceLevel?: string;
  requiredSkills?: string[];
  applicationDeadline?: string;
}

const BrowseProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/projects?status=open", {
          withCredentials: true, // send cookies if backend uses them
        });

        setProjects(res.data.projects || res.data);
      } catch (err: any) {
        console.error("Error fetching projects:", err);
        setError("Failed to fetch projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading projects...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;

  if (projects.length === 0)
    return <p className="text-center mt-8 text-gray-600">No open projects available.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Available Projects</h2>
      {projects.map((p) => (
        <div key={p._id} className="border rounded-md p-4 mb-4 bg-gray-50 shadow-sm">
          <h3 className="text-xl font-semibold">{p.title}</h3>
          <p className="mt-1">{p.description}</p>
          <p className="text-gray-500 mt-1">
            Budget: ${p.budget?.amount} {p.budget?.currency}
          </p>
          <p className="text-gray-500">Category: {p.category}</p>
          {p.experienceLevel && <p className="text-gray-500">Experience: {p.experienceLevel}</p>}
          {p.requiredSkills && (
            <p className="text-gray-500">
              Skills: {p.requiredSkills.join(", ")}
            </p>
          )}
          {p.applicationDeadline && (
            <p className="text-gray-500">
              Deadline: {new Date(p.applicationDeadline).toLocaleDateString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default BrowseProjects;
