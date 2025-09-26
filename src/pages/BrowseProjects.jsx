// client/src/pages/BrowseProjects.jsx

import React, { useState, useEffect } from 'react';
// We will create these components in the next step
// import ProjectCard from '../components/projects/ProjectCard';
// import ProjectFilter from '../components/projects/ProjectFilter';

const BrowseProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder for fetching projects from the API
    const fetchProjects = async () => {
      setLoading(true);
      // const data = await api.getProjects(); // Example API call
      // setProjects(data);
      console.log("Fetching projects...");
      // Mock data
      setProjects([
        { id: 1, title: 'Build a React Dashboard', budget: 1500, skills: ['React', 'Node.js'] },
        { id: 2, title: 'Design a Mobile App UI', budget: 800, skills: ['Figma', 'UI/UX'] },
        { id: 3, title: 'Develop a Python API', budget: 2000, skills: ['Python', 'Flask', 'MongoDB'] }
      ]);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  if (loading) {
    // return <Loader />; // Using the Loader component
    return <p>Loading projects...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Projects</h1>
      {/* <ProjectFilter /> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          // <ProjectCard key={project.id} project={project} />
          <div key={project.id} className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="text-gray-600">Budget: ${project.budget}</p>
            <div className="mt-2">
              {project.skills.map(skill => (
                <span key={skill} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseProjects;