// src/components/projects/ProjectCard.tsx

import React from 'react';

// Define the properties the component will accept
interface ProjectCardProps {
  title: string;
  description: string;
  budget: number;
  skills: string[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, budget, skills }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
      
      <div className="mb-4">
        <span className="text-lg font-semibold text-indigo-600">${budget.toLocaleString()}</span>
        <span className="text-sm text-gray-500"> Budget</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.slice(0, 4).map((skill) => (
          <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            {skill}
          </span>
        ))}
        {skills.length > 4 && (
           <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            +{skills.length - 4} more
          </span>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;