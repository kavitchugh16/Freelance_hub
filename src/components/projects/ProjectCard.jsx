import React from 'react';
import type { Project } from '../../types';
import { Calendar, DollarSign, User, Star } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  isClient?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, isClient = false }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'awarded': return 'bg-orange-100 text-orange-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
              {project.status.replace('_', ' ').charAt(0).toUpperCase() + project.status.replace('_', ' ').slice(1)}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4 mb-2">
          <div className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4" />
            <span className="font-medium">${project.budget.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Due {new Date(project.deadline).toLocaleDateString()}</span>
          </div>
          {!isClient && project.client && (
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{project.client.name}</span>
            </div>
          )}
        </div>

        {project.skills && project.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {project.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {skill}
              </span>
            ))}
            {project.skills.length > 3 && (
              <span className="text-xs text-gray-500">+{project.skills.length - 3} more</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-gray-500">
            Posted {new Date(project.created_at).toLocaleDateString()}
          </div>
          
          {project.awarded_freelancer && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Awarded to:</span>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium">{project.awarded_freelancer.name}</span>
                {project.awarded_freelancer.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs">{project.awarded_freelancer.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};