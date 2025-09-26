// src/pages/BrowseProjects.tsx

import React from 'react';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectFilter from '../components/projects/ProjectFilter';

// Sample data - later we will fetch this from your backend
const sampleProjects = [
  {
    title: 'E-commerce Website for a Local Bakery',
    description: 'Looking for a skilled developer to build a responsive and user-friendly e-commerce site using React and Node.js. Must include payment gateway integration.',
    budget: 2500,
    skills: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
  },
  {
    title: 'Mobile App UI/UX Design',
    description: 'Need a creative designer to craft an intuitive and modern UI/UX for a new fitness tracking mobile application. Deliverables should be in Figma.',
    budget: 1200,
    skills: ['UI/UX Design', 'Figma', 'Mobile App Design'],
  },
  {
    title: 'Python Script for Data Scraping',
    description: 'Seeking a Python expert to write a script that scrapes product data from a list of websites. The script should be well-documented and handle potential errors.',
    budget: 800,
    skills: ['Python', 'Beautiful Soup', 'Data Scraping'],
  },
];

const BrowseProjects: React.FC = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Browse Projects</h1>
      <p className="text-gray-600 mb-8">Find your next opportunity from our list of available projects.</p>

      {/* --- Filter Component --- */}
      <ProjectFilter />

      {/* --- Project List --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sampleProjects.map((project, index) => (
          <ProjectCard
            key={index}
            title={project.title}
            description={project.description}
            budget={project.budget}
            skills={project.skills}
          />
        ))}
      </div>
    </div>
  );
};

export default BrowseProjects;